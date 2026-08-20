<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[var(--bg)]">
    <div class="text-center" v-if="error">
      <i class="fas fa-triangle-exclamation text-4xl text-[var(--delete-color)] mb-4"></i>
      <p class="text-[var(--delete-color)]">{{ error }}</p>
      <a
        href="javascript:window.history.back()"
        class="text-[var(--color-primary)] hover:underline mt-4 block"
      >
        Go back
      </a>
    </div>
    <div class="text-center" v-else>
      <i class="fas fa-spinner fa-spin text-4xl text-[var(--color-primary)] mb-4"></i>
      <p class="text-[var(--text)]">Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const error = ref('');
const token = route.params.token as string;

onMounted(() => {
  // Get API base URL from environment
  const apiBaseUrl = process.env.VUE_APP_STORAGE_API || '';

  try {
    // Navigate directly to the backend endpoint
    // Browser will follow the 302 redirect to R2 presigned URL
    // No CORS issues because navigation ≠ XMLHttpRequest
    window.location.href = `${apiBaseUrl}/api/public/shares/${token}/content`;
  } catch (err: any) {
    error.value = 'Failed to load the file.';
    console.error('Load error:', err);
  }
});
</script>
