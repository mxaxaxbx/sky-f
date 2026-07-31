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

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import * as monaco from 'monaco-editor';

export default defineComponent({
  name: 'EditorComponent',
  components: {
    VueMonacoEditor,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'plaintext', // 'markdown' or 'plaintext'
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editorRef = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
      automaticLayout: true,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    };

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

    return {
      editorOptions,
      handleMount,
    };
  },
});
</script>

<style scoped>
.editor-container {
  min-height: 300px;
}
</style>
