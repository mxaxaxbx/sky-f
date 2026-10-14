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
import Hls from 'hls.js';
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

let hlsInstance: Hls | null = null;
let currentBlobUrl: string | null = null;

function revokeBlobUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

function destroyPlayer() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  revokeBlobUrl();
  const videoEl = internalVideoRef.value;
  if (videoEl) {
    videoEl.removeAttribute('src');
    videoEl.load();
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

async function fallbackPlayback() {
  const videoEl = internalVideoRef.value;
  if (!videoEl) return;

  console.log('[video-streamer] Attempting fallback playback...');

  // Fallback 1: Direct presigned storage URL (browser native HTTP 206 Range streaming)
  const directUrl = await getDirectDownloadUrl();
  if (directUrl) {
    console.log('[video-streamer] Using direct storage URL for native Range streaming');
    videoEl.src = directUrl;
    return;
  }

  // Fallback 2: Legacy stream URL / in-memory blob for small files (< 50MB)
  const token = localStorage.getItem('token');
  const streamUrl = props.streamUrl || (props.file?.id ? await store.dispatch('videostream/getStreamUrl', props.file) : null);
  const fileSize = props.file?.size || 0;

  if (streamUrl && fileSize < 50 * 1024 * 1024) {
    try {
      currentBlobUrl = await fetchAsBlobUrl(streamUrl, token ?? '');
      videoEl.src = currentBlobUrl;
      console.log('[video-streamer] In-memory blob playback ready');
    } catch (blobErr) {
      console.error('[video-streamer] Blob playback fallback failed:', blobErr);
    }
  }
}

async function initStream() {
  const videoEl = internalVideoRef.value;
  if (!videoEl) return;

  destroyPlayer();

  const token = localStorage.getItem('token');
  let m3u8Url = props.streamUrl && (props.streamUrl.endsWith('.m3u8') || props.streamUrl.includes('/hls/'))
    ? props.streamUrl
    : '';

  // 1. Resolve HLS stream URL from streamv2 endpoint if not already provided
  if (!m3u8Url && props.file?.id) {
    try {
      const res = await store.dispatch('videostream/getStreamV2', props.file);
      m3u8Url = res?.m3u8Url || res?.url || '';
      console.log('[video-streamer] Resolved streamv2 HLS manifest URL:', m3u8Url);
    } catch (err) {
      console.warn('[video-streamer] streamv2 request failed, falling back:', err);
    }
  }

  // 2. If no HLS manifest URL is available, go straight to fallback
  if (!m3u8Url) {
    await fallbackPlayback();
    return;
  }

  // Build authenticated manifest URL for native players (iOS/Safari)
  const manifestUrl = token && !m3u8Url.includes('token=')
    ? `${m3u8Url}${m3u8Url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
    : m3u8Url;

  // 3. Try HLS.js first (Chrome, Edge, Firefox, Android)
  if (Hls.isSupported()) {
    console.log('[video-streamer] Initializing HLS.js with chunk buffering configuration');
    hlsInstance = new Hls({
      // Buffer control: only retrieve necessary chunks, save data, and protect mobile RAM
      maxBufferLength: 20, // Buffer max 20 seconds ahead
      maxBufferSize: 30 * 1024 * 1024, // Max 30 MB in memory buffer
      backBufferLength: 10, // Evict chunks behind current playback position
      xhrSetup: (xhr) => {
        if (token) {
          xhr.setRequestHeader('Authorization', `DGTK ${token}`);
        }
      },
    });

    hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
      if (data?.fatal) {
        console.warn('[video-streamer] HLS.js fatal error encountered:', data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('[video-streamer] Trying to recover from network error...');
            hlsInstance?.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('[video-streamer] Trying to recover from media error...');
            hlsInstance?.recoverMediaError();
            break;
          default:
            console.error('[video-streamer] Fatal unrecoverable error, switching to fallback playback');
            destroyPlayer();
            fallbackPlayback();
            break;
        }
      }
    });

    hlsInstance.attachMedia(videoEl);
    hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
      hlsInstance?.loadSource(manifestUrl);
    });
    return;
  }

  // 4. Fallback to Native HLS (Safari on iOS / macOS where MSE is not supported)
  if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    console.log('[video-streamer] Using native Safari HLS playback');
    videoEl.src = manifestUrl;
    return;
  }

  // 5. If neither is supported, use fallback
  await fallbackPlayback();
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
    const streamUrl = props.streamUrl || (props.file?.id ? await store.dispatch('videostream/getStreamUrl', props.file) : null);
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
