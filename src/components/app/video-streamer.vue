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

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import {
  streamWithMSE,
  StreamController,
} from '@/utils/mediaSourceStreaming';

export default defineComponent({
  name: 'VideoStreamer',
  props: {
    // Either provide a fully formed stream URL, or provide a `file` object
    // with `id`, `contentType`, `size`, `name` fields.
    streamUrl: {
      type: String,
      required: false,
    },
    file: {
      type: Object as () => {
        id?: string;
        contentType?: string;
        size?: number;
        name?: string;
      },
      required: false,
    },
    chunkSize: {
      type: Number,
      required: false,
      default: 1024 * 1024,
    },
    mimeCodec: {
      type: String,
      required: false,
    },
    // Parent can receive the internal media element via event `media-ready`
    mediaRef: {
      type: Object as () => { value: HTMLVideoElement | null } | null,
      required: false,
    },
  },
  emits: ['media-ready', 'media-destroyed'],
  setup(props, { emit }) {
    const internalVideoRef = ref<HTMLVideoElement | null>(null);
    const store = useStore();
    let controller: StreamController | null = null;

    onMounted(async () => {
      const videoEl = internalVideoRef.value;
      if (!videoEl) return;

      let url = props.streamUrl;
      if (!url && props.file && props.file.id) {
        try {
          const { dispatch } = store as any;
          url = await dispatch('videostream/getStreamUrl', { id: props.file.id, contentType: props.file.contentType });
        } catch (e) {
          /* fall back to env-based url construction */
          const svc = (process.env as any).VUE_APP_DG_SKY_SVC;
          if (svc && props.file && props.file.id) url = `${svc}/api/files/${props.file.id}/stream`;
        }
      }

      if (!url) {
        // nothing to stream
        if (props.file && props.file.contentType) {
          videoEl.src = '';
        }
        return;
      }

      try {
        controller = await streamWithMSE(videoEl, url, props.file?.size, { chunkSize: props.chunkSize, mimeCodec: props.mimeCodec });
      } catch (err) {
        console.error('Failed to start MSE stream:', err);
        // fallback to direct src
        videoEl.src = url;
      }

      // notify parent that media element is ready
      try {
        emit('media-ready', videoEl);
      } catch (e) {
        // ignore emit errors
      }
    });

    onBeforeUnmount(() => {
      if (controller) controller.abort();
      try {
        emit('media-destroyed');
      } catch (e) {
        // ignore
      }
    });

    return { videoRef: internalVideoRef };
  },
});
</script>

<style scoped>
/* minimal styling left to consumer */
</style>
