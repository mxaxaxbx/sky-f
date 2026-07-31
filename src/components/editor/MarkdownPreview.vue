<template>
  <div class="markdown-preview prose prose-sm md:prose-base dark:prose-invert max-w-none p-4 overflow-auto h-full" v-html="parsedMarkdown"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { marked } from 'marked';

export default defineComponent({
  name: 'MarkdownPreview',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const parsedMarkdown = computed(() => marked.parse(props.content || ''));

    return {
      parsedMarkdown,
    };
  },
});
</script>

<style scoped>
.markdown-preview {
  background-color: #1e1e1e; /* Matches vs-dark theme roughly */
  color: #d4d4d4;
}
</style>
