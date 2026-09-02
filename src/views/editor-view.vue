<template>
  <div class="editor-view flex flex-col h-screen w-full bg-gray-900 text-white">
    <EditorToolbar
      :fileName="currentFileName"
      :hasUnsavedChanges="isEditMode ? true : hasUnsavedChanges"
      :showFormatOptions="isMarkdown"
      @open="openLocalFile"
      @save="saveLocalFileWithContent"
      @undo="triggerUndo"
      @redo="triggerRedo"
    />

    <div v-if="!isEditMode && currentFileName" class="px-4 py-2 bg-gray-800 border-b border-gray-700 flex gap-2">
      <button
        @click="enableEditMode"
        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
      >
        Edit
      </button>
    </div>

    <div v-if="isEditMode" class="px-4 py-2 bg-gray-800 border-b border-gray-700 flex gap-2">
      <button
        @click="saveLocalFileWithContent"
        class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
      >
        Save Changes
      </button>
      <button
        @click="disableEditMode"
        class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
      >
        Cancel
      </button>
    </div>

    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <!-- Editor Pane -->
      <div
        class="flex-1 h-full min-h-0 relative"
        :class="{ 'border-b md:border-b-0 md:border-r border-gray-700': isMarkdown && showPreview }"
      >
        <EditorComponent
          :model-value="isEditMode ? editedContent : fileContent"
          @update:model-value="(val) => { if (isEditMode) editedContent = val; }"
          :language="editorLanguage"
          :is-large-file="isLargeFile"
          :read-only="!isEditMode"
          ref="editorComponentRef"
        />
        <div v-if="isLargeFile" class="absolute top-2 right-2 px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded pointer-events-none">
          Large file ({{ formatFileSize(currentFileSize) }}) — optimized mode
        </div>
      </div>

      <!-- Markdown Preview Pane -->
      <div v-if="isMarkdown && showPreview && !isLargeFile" class="flex-1 h-full min-h-0 overflow-y-auto bg-gray-900">
        <MarkdownPreview :content="fileContent" :is-large-file="isLargeFile" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
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

const editedContent = ref('');
const isEditMode = ref(false);

const fileContent = computed(() => rawFileContent.value);

const showPreview = ref(true);

const enableEditMode = () => {
  editedContent.value = rawFileContent.value;
  isEditMode.value = true;
};

const disableEditMode = () => {
  isEditMode.value = false;
};

const openLocalFile = () => {
  store.dispatch('openLocalFile');
};

const saveLocalFile = () => {
  store.dispatch('saveLocalFile');
};

const saveLocalFileWithContent = async () => {
  if (isEditMode.value) {
    store.dispatch('updateContent', editedContent.value);
  }
  saveLocalFile();
  disableEditMode();
};

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
      await store.dispatch('editor/loadFileById', fileId);
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
</script>

<style scoped>
.editor-view {
  height: 100vh;
}
</style>
