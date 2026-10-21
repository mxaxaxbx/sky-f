<template>
  <div class="w-full h-full flex items-center justify-center">
    <video
      ref="internalVideoRef"
      :controls="controls"
      class="max-w-full max-h-full object-contain"
      :title="`Video: ${file?.name || 'stream'}`"
      v-bind="$attrs"
    >
      <track kind="captions" />
    </video>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  watch,
  ref,
  computed,
  withDefaults,
  defineProps,
  defineEmits,
} from 'vue';
import { useStore } from 'vuex';
import {
  streamWithMSE,
  fetchBlobWithRangeChunks,
  StreamController,
} from '@/utils/mediaSourceStreaming';
import { extractMP4Metadata } from '@/utils/mp4Metadata';

type VideoFile = {
  id?: string | number;
  contentType?: string;
  size?: number;
  name?: string;
};

const props = withDefaults(
  defineProps<{
    // Either provide a fully formed stream URL, or provide a `file` object
    // with `id`, `contentType`, `size`, `name`.
    streamUrl?: string;
    file?: VideoFile;
    chunkSize?: number;
    mimeCodec?: string;
    controls?: boolean;
  }>(),
  {
    chunkSize: 1024 * 1024, // 1MB chunks by default
    controls: false,
  },
);

const emit = defineEmits<{
  'media-ready': [value: HTMLVideoElement];
  'media-destroyed': [];
}>();

const internalVideoRef = ref<HTMLVideoElement | null>(null);
const store = useStore();

const metadata = computed(() => store.state.videostream.metadata);

let controller: StreamController | null = null;
let currentBlobUrl: string | null = null;

function revokeBlobUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

function destroyPlayer() {
  if (controller) {
    controller.abort();
    controller = null;
  }
  revokeBlobUrl();
  const videoEl = internalVideoRef.value;
  if (videoEl) {
    videoEl.removeAttribute('src');
    videoEl.load();
  }
}

async function resolveStreamUrl(): Promise<string> {
  if (props.streamUrl) {
    return props.streamUrl;
  }
  if (props.file?.id) {
    const streamUrl = await store.dispatch('videostream/getStreamUrl', {
      id: props.file.id,
      contentType: props.file.contentType || 'video/mp4',
    });
    return streamUrl || '';
  }
  return '';
}

async function initStream() {
  const videoEl = internalVideoRef.value;
  if (!videoEl) return;

  destroyPlayer();

  const url = await resolveStreamUrl();
  if (!url) return;

  const resolvedFileSize = props.file?.size || metadata.value?.fileSize;
  const resolvedChunkSize = metadata.value?.chunkSize || props.chunkSize;

  try {
    controller = await streamWithMSE(
      videoEl,
      url,
      resolvedFileSize,
      {
        chunkSize: resolvedChunkSize,
        mimeCodec: props.mimeCodec,
      },
      metadata.value,
      props.file,
    );
  } catch (err) {
    console.warn('[video-streamer] MSE streaming failed, falling back to Range chunk fetch:', err);
    try {
      const blob = await fetchBlobWithRangeChunks(
        url,
        resolvedFileSize,
        resolvedChunkSize,
        undefined,
        props.file?.contentType,
      );
      currentBlobUrl = URL.createObjectURL(blob);
      videoEl.src = currentBlobUrl;
    } catch (blobErr) {
      console.error('[video-streamer] Range chunk blob fallback failed:', blobErr);
      videoEl.src = url;
    }
  }
}

async function getMetadata() {
  if (!props.file?.id) return;
  let metadataFailed = false;

  try {
    await store.dispatch('videostream/getVideoMetadata', {
      id: props.file.id,
      contentType: props.file.contentType,
    });

    // Check if metadata is usable (valid numeric duration)
    const meta = store.state.videostream.metadata;
    const hasValidMetadata = typeof meta?.duration === 'number'
      && Number.isFinite(meta.duration)
      && meta.duration > 0;

    if (!hasValidMetadata) {
      metadataFailed = true;
    }
  } catch (err) {
    console.error('Failed to fetch video metadata:', err);
    metadataFailed = true;
  }

  // If metadata service failed or returned invalid data, extract from MP4 (only for MP4 containers)
  const isMp4 = props.file?.contentType?.includes('mp4') || props.file?.name?.toLowerCase().endsWith('.mp4');
  const effectiveSize = props.file?.size || store.state.videostream.metadata?.fileSize;
  if (metadataFailed && effectiveSize && isMp4) {
    console.log('[getMetadata] Service metadata unavailable, extracting from MP4...');
    const rawStreamUrl = await resolveStreamUrl();
    if (rawStreamUrl) {
      const token = localStorage.getItem('token');
      const extracted = await extractMP4Metadata(rawStreamUrl, effectiveSize, token ?? undefined);

      if (extracted.duration) {
        console.log('[getMetadata] Successfully extracted duration from MP4:', extracted.duration);
        const meta = store.state.videostream.metadata;
        store.commit('SET_VIDEOSTREAM_METADATA', {
          ...meta,
          duration: extracted.duration,
        });
      } else {
        console.warn('[getMetadata] Failed to extract MP4 metadata:', extracted.error);
      }
    }
  }
}

onMounted(async () => {
  const videoEl = internalVideoRef.value;
  if (!videoEl) return;
  await getMetadata();
  await initStream();

  emit('media-ready', videoEl);
});

// React to a streamUrl/file that resolves *after* mount (e.g. async Vuex
// dispatch in the parent) — this was the original bug: nothing watched it.
watch(
  () => [props.streamUrl, props.file?.id],
  async () => {
    await getMetadata();
    await initStream();
  },
);

onBeforeUnmount(() => {
  destroyPlayer();
  emit('media-destroyed');
});
</script>

<style scoped>
/* minimal styling left to consumer */
</style>
