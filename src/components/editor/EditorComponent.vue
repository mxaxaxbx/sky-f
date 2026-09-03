<template>
  <div class="editor-container w-full h-full">
    <component
      v-if="monacoComp"
      :is="monacoComp"
      :value="modelValue"
      :language="language"
      :theme="theme"
      :options="editorOptions"
      @mount="handleMount"
      class="w-full h-full"
    />

    <div v-else class="p-4 h-full overflow-auto bg-gray-900 text-white">
      <div class="mb-3 text-sm text-yellow-300">
        This file is large — the full Monaco editor is disabled by default to avoid freezing the browser.
      </div>
      <pre class="whitespace-pre-wrap max-h-[60vh] overflow-auto text-xs bg-gray-800 p-3 rounded">{{ previewText }}</pre>
        <div class="mt-2">
          <button @click="triggerForceLoad" class="px-3 py-1 bg-blue-600 text-white rounded">Load in editor (may be slow)</button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'plaintext',
  },
  theme: {
    type: String,
    default: 'vs-dark',
  },
  isLargeFile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editorRef = ref<any | null>(null);
const monacoComp = ref<any | null>(null);
const forceLoad = ref(false);

// Threshold to consider a file "very large" for the in-browser Monaco editor
const LARGE_LIMIT = 5 * 1024 * 1024; // 5 MB

const editorOptions = computed(() => {
  const baseOptions: any = {
    automaticLayout: true,
    wordWrap: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  };

  if (props.isLargeFile) {
    return {
      ...baseOptions,
      formatOnType: false,
      formatOnPaste: false,
      'bracketPairColorization.enabled': false,
      'bracketPairColorization.independentColorPoolPerBracketType': false,
      glyphMargin: false,
      lineNumbersMinChars: 3,
      renderWhitespace: 'none',
      renderControlCharacters: false,
      quickSuggestionsDelay: 500,
    };
  }

  return baseOptions;
});

const handleMount = (editor: any) => {
  editorRef.value = editor;
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue());
  });
};

const shouldUseMonaco = computed(() => {
  const size = props.isLargeFile ? Number.POSITIVE_INFINITY : (props.modelValue ? props.modelValue.length : 0);
  return (!props.isLargeFile && size < LARGE_LIMIT) || forceLoad.value;
});

const loadMonaco = async () => {
  if (monacoComp.value) return;
  const mod = await import('@guolao/vue-monaco-editor');
  monacoComp.value = mod.VueMonacoEditor || mod.default || mod;
};

const triggerForceLoad = async () => {
  forceLoad.value = true;
  await loadMonaco();
};

const previewText = computed(() => {
  const max = 20000; // chars
  if (!props.modelValue) return '';
  return props.modelValue.length > max ? `${props.modelValue.slice(0, max)}\n\n...truncated...` : props.modelValue;
});

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.getValue && editorRef.value.getValue() !== newValue) {
    editorRef.value.setValue(newValue);
  }
});

// Auto-load Monaco when appropriate
watch(shouldUseMonaco, (v) => {
  if (v) loadMonaco();
});
</script>

<style scoped>
.editor-container {
  min-height: 300px;
}
</style>
