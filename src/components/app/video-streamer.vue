<template>
  <div class="w-full h-full flex items-center justify-center">
    <video
      ref="internalVideoRef"
      controls
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
  }>(),
  {
    chunkSize: 1024 * 1024, // 1MB chunks by default
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
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Stream fetch failed: ${res.status}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
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
  if (!videoEl || !url) return;

  // Tear down any previous stream/blob before starting a new one.
  controller?.abort();
  controller = null;
  revokeBlobUrl();

  try {
    const token = localStorage.getItem('token');
    // Preferred path: MSE streaming, which supports range requests / seeking.
    // NOTE: streamWithMSE must forward `Authorization: Bearer ${token}` on
    // its internal fetch calls for this to actually authenticate.
    controller = await streamWithMSE(
      videoEl,
      url,
      props.file?.size,
      {
        chunkSize: props.chunkSize,
        mimeCodec: props.mimeCodec,
        token,
      } as any,
      metadata.value,
    );
  } catch (err) {
    console.error('Failed to start MSE stream, falling back to blob:', err);
    try {
      const token = localStorage.getItem('token');
      currentBlobUrl = await fetchAsBlobUrl(url, token ?? '');
      videoEl.src = currentBlobUrl;
    } catch (blobErr) {
      console.error('Authenticated fallback fetch also failed:', blobErr);
    }
  }
}

async function getMetadata() {
  if (!props.file?.id) return;
  try {
    await store.dispatch('videostream/getVideoMetadata', {
      id: props.file.id,
    });
  } catch (err) {
    console.error('Failed to fetch video metadata:', err);
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
