<template>
  <div
    class="
      bg-[var(--bg)]
      h-screen
      font-alexandria font-sans
    "
  >
    <div
      class="
        mx-auto
        flex flex-col items-start
        pt-0 px-0 w-full
        sm:pt-16
      "
    >
      <!-- folder details -->
      <div v-if="folderDetails && folderDetails.id" class="mx-auto w-full pb-2 px-8 flex justify-between">
        <div class="flex items-center gap-1">
          <!-- Back button -->
          <button
            @click="$router.back()"
            class="
              flex items-center gap-2
              px-2
              grayscale
              text-[var(--text-terceary)] font-semibold text-xl
              hover:text-[var(--text)] hover:grayscale-0
              transition-colors duration-200
            "
          >
            <img src="/icon/icon-cloudDrive-active.svg" alt="folder" class="h-6"/>
            Could Drive
          </button>
          <span class="text-[var(--text-terceary)]">></span>
          <div class="flex items-center gap-2 px-2">
            <img src="/icon/icon-folder.svg" alt="folder" class="h-6 w-6"/>
            <h2 class="text-xl sm:text-xl font-regular text-[var(--text)]">
              {{ folderDetails.name }}
            </h2>
          </div>
        </div>
        <div
          class="mx-4">
          <div
            class="flex flex-col items-end
            "
          >
            <!-- Created date -->
            <div class="px-2 flex items-center justify-center gap-2">
              <div class="">
                <h3 class="text-xs font-regular text-[var(--text-terceary)]">
                  Creation date:
                </h3>
              </div>
              <p class="text-xs font-light text-[var(--text)]">
                {{ moment(folderDetails.created * 1000).format('DD/MM/YYYY HH:mm a') }}
              </p>
            </div>

            <!-- Updated date -->
            <div class="px-2 flex items-center justify-end gap-2">
              <div class="flex items-center justify-end">
                <h3 class="text-xs font-regular text-[var(--text-terceary)]">
                  Last modification:
                </h3>
              </div>
              <p class="text-xs font-light text-[var(--text)]">
                {{ moment(folderDetails.updated * 1000).format('DD/MM/YYYY HH:mm a') }}
              </p>
            </div>

            <div class="px-2 flex items-center justify-center gap-2">
              <div class="">
                <h3 class="text-xs font-regular text-[var(--text-terceary)]">
                  Size:
                </h3>
              </div>
              <p class="text-xs font-light text-[var(--text)]">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  watch,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import moment from 'moment';

import { FolderI } from '@/store/folders/state';
import { FileI } from '@/store/files/state';

const store = useStore();
const route = useRoute();
const loading = ref(false);

const folderDetails = computed<FolderI>(() => store.state.folders.folder);
const folderId = computed<number>(() => Number(route.params.id as string));
const file = computed<FileI>(() => store.state.files.file);

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

async function getFolderDetails() {
  loading.value = true;
  console.log('folderId', folderId.value);
  try {
    await store.dispatch('folders/getFolderDetails', {
      folderId: Number(folderId.value),
    });
  } catch (error) {
    console.error('Error loading folder details:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los detalles de la carpeta',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getFolderDetails();
});

watch(() => route.params.id, () => {
  getFolderDetails();
}, { immediate: true });
</script>
