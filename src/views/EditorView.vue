<template>
  <div class="editor-view flex flex-col h-screen w-full bg-gray-900 text-white">
    <EditorToolbar
      :fileName="currentFileName"
      :hasUnsavedChanges="hasUnsavedChanges"
      :showFormatOptions="isMarkdown"
      @open="openLocalFile"
      @save="saveLocalFile"
      @undo="triggerUndo"
      @redo="triggerRedo"
    />

    <div class="flex-1 flex overflow-hidden">
      <!-- Editor Pane -->
      <div
        class="flex-1 h-full"
        :class="{ 'border-r border-gray-700': isMarkdown && showPreview }"
      >
        <EditorComponent
          v-model="fileContent"
          :language="editorLanguage"
          ref="editorComponentRef"
        />
      </div>

      <!-- Markdown Preview Pane -->
      <div v-if="isMarkdown && showPreview" class="flex-1 h-full bg-gray-900">
        <MarkdownPreview :content="fileContent" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { onBeforeRouteLeave } from 'vue-router';
import EditorToolbar from '../components/editor/EditorToolbar.vue';
import EditorComponent from '../components/editor/EditorComponent.vue';
import MarkdownPreview from '../components/editor/MarkdownPreview.vue';

export default defineComponent({
  name: 'EditorView',
  components: {
    EditorToolbar,
    EditorComponent,
    MarkdownPreview,
  },
  setup() {
    const store = useStore();

    const currentFileName = computed(() => store.state.editor.currentFileName);
    const hasUnsavedChanges = computed(() => store.state.editor.hasUnsavedChanges);
    const rawFileContent = computed(() => store.state.editor.currentFileContent);

    const isMarkdown = computed(() => {
      const name = currentFileName.value;
      return name ? name.toLowerCase().endsWith('.md') : false;
    });

    const editorLanguage = computed(() => (isMarkdown.value ? 'markdown' : 'plaintext'));

    const fileContent = computed({
      get: () => rawFileContent.value,
      set: (val: string) => store.dispatch('updateContent', val),
    });

    const showPreview = ref(true); // Toggleable in the future if needed

    const openLocalFile = () => {
      store.dispatch('openLocalFile');
    };

    const saveLocalFile = () => {
      store.dispatch('saveLocalFile');
    };

    // Unsaved changes warning
    onBeforeRouteLeave((to, from, next) => {
      if (hasUnsavedChanges.value) {
        const answer = window.confirm('You have unsaved changes. Do you really want to leave?');
        if (answer) {
          next();
        } else {
          next(false);
        }
      } else {
        next();
      }
    });

    onBeforeUnmount(() => {
      if (hasUnsavedChanges.value) {
        // Just in case, handled by route leave usually.
      }
    });

    // We can't directly trigger undo/redo in Monaco without ref to editor instance,
    // but we can pass it down or handle it later. The Toolbar emits these.
    // For now, we stub them.
    const triggerUndo = () => {
      // Stub
    };

    const triggerRedo = () => {
      // Stub
    };

    return {
      currentFileName,
      hasUnsavedChanges,
      isMarkdown,
      editorLanguage,
      fileContent,
      showPreview,
      openLocalFile,
      saveLocalFile,
      triggerUndo,
      triggerRedo,
    };
  },
});
</script>

<style scoped>
.editor-view {
  height: 100vh;
}
</style>
