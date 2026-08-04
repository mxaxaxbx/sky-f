<template>
  <div class="editor-container w-full h-full">
    <vue-monaco-editor
      :value="modelValue"
      :language="language"
      :theme="theme"
      :options="editorOptions"
      @mount="handleMount"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  defineProps,
  defineEmits,
} from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import * as monaco from 'monaco-editor';

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

const editorRef = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

const editorOptions = computed(() => {
  const baseOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
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

const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editorRef.value = editor;
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue());
  });
};

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.getValue() !== newValue) {
    editorRef.value.setValue(newValue);
  }
});
</script>

<style scoped>
.editor-container {
  min-height: 300px;
}
</style>
