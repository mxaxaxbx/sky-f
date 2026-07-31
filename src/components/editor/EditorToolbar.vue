<template>
  <div class="editor-toolbar flex items-center justify-between p-2 bg-gray-800 text-white border-b border-gray-700">
    <div class="flex space-x-2">
      <button @click="$emit('open')" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
        Open
      </button>
      <button @click="$emit('save')" class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors" :disabled="!hasUnsavedChanges" :class="{ 'opacity-50 cursor-not-allowed': !hasUnsavedChanges }">
        Save
      </button>
    </div>

    <div class="flex space-x-4 items-center">
      <span v-if="fileName" class="text-sm text-gray-300">
        {{ fileName }}
        <span v-if="hasUnsavedChanges" class="text-yellow-400 ml-1">*</span>
      </span>

      <div class="flex space-x-2" v-if="showFormatOptions">
        <button @click="$emit('format-bold')" class="px-2 py-1 hover:bg-gray-700 rounded text-sm transition-colors" title="Bold">
          <b>B</b>
        </button>
        <button @click="$emit('format-italic')" class="px-2 py-1 hover:bg-gray-700 rounded text-sm transition-colors" title="Italic">
          <i>I</i>
        </button>
      </div>

      <div class="flex space-x-2">
        <button @click="$emit('undo')" class="px-2 py-1 hover:bg-gray-700 rounded text-sm transition-colors" title="Undo">
          Undo
        </button>
        <button @click="$emit('redo')" class="px-2 py-1 hover:bg-gray-700 rounded text-sm transition-colors" title="Redo">
          Redo
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorToolbar',
  props: {
    fileName: {
      type: String,
      default: '',
    },
    hasUnsavedChanges: {
      type: Boolean,
      default: false,
    },
    showFormatOptions: {
      type: Boolean,
      default: false, // E.g., true for markdown
    },
  },
  emits: ['open', 'save', 'undo', 'redo', 'format-bold', 'format-italic'],
});
</script>

<style scoped>
/* Toolbar styles handled mostly by Tailwind */
</style>
