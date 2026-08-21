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

    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <!-- Editor Pane -->
      <div
        class="flex-1 h-full min-h-0 relative"
        :class="{ 'border-b md:border-b-0 md:border-r border-gray-700': isMarkdown && showPreview }"
      >
        <EditorComponent
          v-model="fileContent"
          :language="editorLanguage"
          :is-large-file="isLargeFile"
          ref="editorComponentRef"
        />
        <div v-if="isLargeFile" class="absolute top-2 right-2 px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded pointer-events-none">
          Large file ({{ formatFileSize(currentFileSize) }}) — optimized mode
        </div>
      </div>

      <!-- Markdown Preview Pane -->
      <div v-if="isMarkdown && showPreview" class="flex-1 h-full min-h-0 overflow-y-auto bg-gray-900">
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
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

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
    const route = useRoute();

    const currentFileName = computed(() => store.state.editor.currentFileName);
    const hasUnsavedChanges = computed(() => store.state.editor.hasUnsavedChanges);
    const rawFileContent = computed(() => store.state.editor.currentFileContent);
    const isLargeFile = computed(() => store.state.editor.isLargeFile);
    const currentFileSize = computed(() => store.state.editor.currentFileSize);

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

    onMounted(async () => {
      const fileId = route.params.id as string | undefined;
      if (fileId) {
        try {
          await store.dispatch('loadFileById', fileId);
        } catch (error) {
          console.error('Failed to load file:', error);
          store.commit('notifications/addNotification', {
            type: 'error',
            message: 'Failed to load file',
          });
        }
      }
    });

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const size = Math.round((bytes / (k ** i)) * 100) / 100;
      return `${size} ${sizes[i]}`;
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
      isLargeFile,
      currentFileSize,
      formatFileSize,
    };
  },
});
</script>

<style scoped>
.editor-view {
  height: 100vh;
}
</style>
