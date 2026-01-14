<template>
  <div
    class="
      flex items-center justify-center
      w-full h-full mx-auto my-auto
      rounded-xl mb-8 z-50
      transition-colors duration-300
    "
    :class="[
      hasFiles
        ? 'border-solid border-[#9DC9FA]'
        : 'border-dashed border-[#9DC9FA]',
    ]"
  >
    <!-- Mostrar zona de carga solo si no hay archivos -->
    <div
      v-if="!hasFiles"
      class="flex flex-col items-center">
      <img
        src="/icon/icon-cloudUpload.svg"
        alt="icon"
        class="w-[250px] m-0 opacity-100" />
      <h1 class="text-xl sm:2xl text-center text-[var(--text)] font-bold mb-6">
        Nothing in your private vault yet
      </h1>
      <p class="text-md sm:text-sm text-center text-[var(--text-terceary)] font-light mb-6">
        Drag and drop your files here
      </p>
      <label for="fileInput" class="
          flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          py-2 px-8
          rounded-full
          cursor-pointer
          hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          transition-all duration-300 ease-in-out
          pointer-events-auto
        " :class="{ 'opacity-50': loading }">
        <img src="/icon/icon-upload.svg" alt="icon" class="h-6 mr-3" />
        <span>Upload</span>
        <input
          id="fileInput"
          type="file"
          class="hidden"
          ref="fileInput"
          @change="uploadFile"
          :multiple="false"
          :disabled="loading"
        />
      </label>
    </div>
    <div v-else class="text-center text-[#3d3d3d]">
      <p class="text-lg font-medium">File uploaded: {{ file?.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const loading = ref(false);

const file = ref<File | null>(null);
const hasFiles = computed(() => !!file.value); // Nuevo: indica si ya hay archivo

// 🟦 Lógica original de subida (sin cambios)
async function uploadFile(ev: Event): Promise<void> {
  loading.value = true;
  try {
    const target = ev.target as HTMLInputElement;
    if (!target.files) {
      return;
    }

    [file.value] = target.files;
    const formData = new FormData();
    formData.append('file', file.value);

    await store.dispatch('files/upload', formData);
    store.commit('notifications/addNotification', {
      type: 'success',
      message: 'Archivo subido correctamente',
    });
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.error || 'Error al subir el archivo';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    loading.value = false;
  }
}

</script>
