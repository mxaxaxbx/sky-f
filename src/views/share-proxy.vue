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
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

const error = ref('');
const token = route.params.token as string;

onMounted(async () => {
  try {
    // Fetch the raw file content via the store action
    const response = await store.dispatch('shares/getPublicShareContentStream', {
      token,
    });

    // Create blob with proper content-type so browser renders it natively
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: contentType });

    // Create object URL and navigate to it - browser will render natively
    const objectUrl = URL.createObjectURL(blob);
    window.location.href = objectUrl;
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to load the file.';
    console.error('Load error:', err);
  }
});
</script>
