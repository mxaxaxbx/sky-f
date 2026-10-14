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
  type StreamController,
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

async function fetchAsBlobUrl(url: string, token?: string) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `DGTK ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Stream fetch failed: ${res.status}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

async function getDirectDownloadUrl(): Promise<string | null> {
  if (props.file?.id) {
    try {
      const directUrl = await store.dispatch('files/getDownloadUrl', {
        id: props.file.id,
        contentType: props.file.contentType,
        name: props.file.name,
        size: props.file.size,
      });
      if (directUrl && typeof directUrl === 'string' && directUrl.startsWith('http')) {
        return directUrl;
      }
    } catch (err) {
      console.warn('[video-streamer] Could not retrieve direct storage URL:', err);
    }
  }
  return null;
}

async function resolveUrl(): Promise<string | undefined> {
  if (props.streamUrl) return props.streamUrl;
  if (props.file?.id) {
    return store.dispatch('videostream/getStreamUrl', {
      id: props.file.id,
      contentType: props.file.contentType,
    });
  }
  return undefined;
}

async function initStream(url?: string) {
  const videoEl = internalVideoRef.value;
  if (!videoEl) return;

  // Tear down any previous stream/blob before starting a new one.
  controller?.abort();
  controller = null;
  revokeBlobUrl();

  const token = localStorage.getItem('token');
  const fileSize = props.file?.size || 0;
  const isLargeVideo = fileSize > 20 * 1024 * 1024; // > 20MB

  // For large videos (e.g. >20MB), bypass MSE chunking and in-memory blobs.
  // Use direct presigned storage URL with native browser HTTP 206 Range requests.
  // This eliminates browser crashes (out-of-memory) and enables instant seeking across gigabyte-sized videos.
  if (isLargeVideo && props.file?.id) {
    console.log('[video-streamer] Large video detected, obtaining direct storage URL for native Range streaming', {
      fileSize,
      name: props.file?.name,
    });
    const directUrl = await getDirectDownloadUrl();
    if (directUrl) {
      console.log('[video-streamer] Direct storage URL set on video element for native Range streaming');
      videoEl.src = directUrl;
      return;
    }
    console.warn('[video-streamer] Direct storage URL unavailable, proceeding to MSE/fallback');
  }

  const streamUrl = url || (await resolveUrl());
  if (!streamUrl) return;

  try {
    controller = await streamWithMSE(
      videoEl,
      streamUrl,
      props.file?.size,
      {
        chunkSize: props.chunkSize,
        mimeCodec: props.mimeCodec,
        token,
      } as any,
      metadata.value,
      props.file,
    );
  } catch (err) {
    console.error('Failed to start MSE stream, falling back:', err);

    // Fallback 1: Try direct storage URL for native browser Range playback
    if (props.file?.id) {
      const directUrl = await getDirectDownloadUrl();
      if (directUrl) {
        console.log('[video-streamer] Fallback to direct storage URL successful');
        videoEl.src = directUrl;
        return;
      }
    }

    // Fallback 2: Only small files (< 50MB) can safely fetch as blob in JS memory
    if (fileSize < 50 * 1024 * 1024) {
      try {
        currentBlobUrl = await fetchAsBlobUrl(streamUrl, token ?? '');
        videoEl.src = currentBlobUrl;
      } catch (blobErr) {
        console.error('Authenticated fallback fetch also failed:', blobErr);
      }
    } else {
      console.warn('[video-streamer] File is too large for in-memory blob fallback (>50MB). Blob fetch aborted to protect browser.');
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

    // Check if metadata is usable (not "unknown")
    const meta = store.state.videostream.metadata;
    const hasValidMetadata = meta?.duration && meta.duration !== 'unknown (ffmpeg required)';

    if (!hasValidMetadata) {
      metadataFailed = true;
    }
  } catch (err) {
    console.error('Failed to fetch video metadata:', err);
    metadataFailed = true;
  }

  // If metadata service failed or returned invalid data, extract from MP4 (only for MP4 containers)
  const isMp4 = props.file?.contentType?.includes('mp4') || props.file?.name?.toLowerCase().endsWith('.mp4');
  if (metadataFailed && props.file?.size && isMp4) {
    console.log('[getMetadata] Service metadata unavailable, extracting from MP4...');
    const streamUrl = props.streamUrl || (await resolveUrl());
    if (streamUrl) {
      const token = localStorage.getItem('token');
      const extracted = await extractMP4Metadata(streamUrl, props.file.size, token ?? undefined);

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

  const url = await resolveUrl();
  await initStream(url);

  emit('media-ready', videoEl);
});

// React to a streamUrl/file that resolves *after* mount (e.g. async Vuex
// dispatch in the parent) — this was the original bug: nothing watched it.
watch(
  () => [props.streamUrl, props.file?.id],
  async () => {
    await getMetadata();
    const url = await resolveUrl();
    if (url) initStream(url);
  },
);

onBeforeUnmount(() => {
  controller?.abort();
  revokeBlobUrl();
  emit('media-destroyed');
});
</script>

<style scoped>
/* minimal styling left to consumer */
</style>
