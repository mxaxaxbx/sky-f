<template>
  <div :class="['markdown-preview prose prose-sm md:prose-base dark:prose-invert max-w-none p-4 overflow-auto h-full', { 'gpu-enabled': supportsGPU() }]" v-html="parsedMarkdown"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import {
  marked,
} from 'marked';

export default defineComponent({
  name: 'MarkdownPreview',
  props: {
    content: {
      type: String,
      required: true,
    },
    isLargeFile: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const parsedMarkdown = ref('');
    const workerRef = ref<Worker | null>(null);
    const msgId = ref(0);

    const supportsGPU = () => {
      // Check for WebGPU or WebGL2 as a proxy for GPU support
      try {
        if ((navigator as any).gpu) return true; // WebGPU
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
      } catch (e) {
        return false;
      }
    };

    const useWorker = (): boolean => props.isLargeFile || supportsGPU();
    const parseInMainThread = (text: string) => {
      try {
        const res = marked.parse(text || '');
        Promise.resolve(res)
          .then((html) => {
            parsedMarkdown.value = String(html || '');
          })
          .catch(() => {
            parsedMarkdown.value = `<pre>${(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
          });
      } catch (e) {
        parsedMarkdown.value = `<pre>${(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
      }
    };

    const ensureWorker = () => {
      if (workerRef.value) return;
      try {
        // Worker script served from public/
        workerRef.value = new Worker('/markdown-worker.js');
        workerRef.value.addEventListener('message', (ev) => {
          const { id, html } = ev.data || {};
          // only use latest message
          if (id === msgId.value) {
            parsedMarkdown.value = html || '';
          }
        });
      } catch (e) {
        workerRef.value = null;
      }
    };

    const parseWithWorker = (text: string) => {
      if (!('Worker' in window)) {
        parseInMainThread(text);
        return;
      }
      ensureWorker();
      if (!workerRef.value) {
        parseInMainThread(text);
        return;
      }
      msgId.value += 1;
      workerRef.value.postMessage({ id: msgId.value, content: text });
    };

    watch(
      () => props.content,
      (v) => (useWorker() ? parseWithWorker(v || '') : parseInMainThread(v || '')),
      { immediate: true },
    );

    onMounted(() => {
      // initial parse already triggered by watch immediate
    });

    onBeforeUnmount(() => {
      if (workerRef.value) {
        workerRef.value.terminate();
        workerRef.value = null;
      }
    });

    return {
      parsedMarkdown,
      supportsGPU,
    };
  },
});
</script>

<style scoped>
.markdown-preview {
  background-color: #1e1e1e; /* Matches vs-dark theme roughly */
  color: #d4d4d4;
}

.markdown-preview.gpu-enabled {
  /* Hint the browser to use the GPU compositor for this layer */
  transform: translateZ(0);
  will-change: transform, opacity;
}
</style>
