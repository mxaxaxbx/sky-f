<template>
  <div
    class="
      bg-[var(--bg)]
      h-screen
      font-alexandria font-sans
      pt-14 sm:pt-0
    "
  >
    <div
      class="
        mx-auto
        flex flex-col items-start
        pt-12 px-0 w-full
        sm:pt-16
      "
    >
      <!-- folder details -->
      <div
        v-if="folderDetails && folderDetails.id"
        class="
          flex justify-between items-center
          w-full
          mx-auto px-2
          sm:px-8
        "
      >
        <div class="flex items-center gap-1">
          <!-- Back button -->
          <router-link
            to="/app/files"
            class="
              flex items-center
              gap-2 px-2
              grayscale
              text-[var(--text-terceary)] font-semibold
              text-xs

              sm:text-sm md:text-md lg:text-lg

              hover:text-[var(--text)] hover:grayscale-0
              transition-colors duration-200
            "
          >
            <img src="/icon/icon-cloudDrive-active.svg" alt="folder" class="h-5 sm:h-6"/>
            Could Drive
          </router-link>
          <span class="text-[var(--text-terceary)]">></span>
          <div class="flex items-center gap-2 px-2">
            <img src="/icon/icon-folder.svg" alt="folder" class="h-5 sm:h-6"/>
            <h2
              class="
                font-light text-[var(--text)]
                text-xs

                sm:text-sm md:text-md lg:text-lg
              "
            >
              {{ folderDetails.name }}
            </h2>
          </div>
        </div>
        <div class="mx-4 hidden sm:inline">
          <!-- actions desktop-->
          <div class="flex items-center gap-2">

            <!-- Upload button -->
            <label
              v-if="!hideBar"
              for="fileInputBtn"
              class="
                hidden items-center
                bg-[var(--color-primary)]
                border border-[var(--color-primary)]
                text-white text-sm font-medium
                px-2 py-0.5
                rounded-full

                sm:flex
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300 ease-in-out
                cursor-pointer
              "
            >
              <img src="/icon/icon-upload.svg" alt="icon" class="h-4 mr-2" />
              <span>Upload</span>
            </label>

            <!-- New folder-->
            <button
              v-if="!hideBar"
              @click="createFolderModal = true"
              class="
                hidden items-center
                bg-[var(--bg-secondary)]
                border border-[var(--border)]
                text-[var(--text-terceary)] text-sm font-medium
                pl-2 pr-2.5 py-0.5
                grayscale
                rounded-full

                sm:flex
                hover:grayscale-0
                hover:text-[var(--text)]
                hover:bg-[var(--hover-bg)]
                hover:border-[var(--hover-border)]
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:border-[var(--hover-border)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:grayscale-0
                transition-all duration-300 ease-in-out
                cursor-pointer
              "
            >
              <img src="/icon/icon-new-folder.svg" alt="icon" class="h-5 mr-2" />
              New folder
            </button>

            <div class="flex flex-col items-end justify-end ml-4 hidden lg:inline">
            <!-- Created date -->
            <div class="px-2 flex items-center justify-center gap-2 ">
              <div class="">
                <h3 class="text-[0.6rem] font-regular text-[var(--text-terceary)]">
                  Creation date:
                </h3>
              </div>
              <p class="text-[0.6rem] font-light text-[var(--text)]">
                {{ moment(folderDetails.created * 1000).format('DD/MM/YYYY') }}
              </p>
            </div>

            <!-- Updated date -->
            <div class="px-2 flex items-center justify-end gap-2">
              <div class="flex items-center justify-end">
                <h3 class="text-[0.6rem] font-regular text-[var(--text-terceary)]">
                  Last modification:
                </h3>
              </div>
              <p class="text-[0.6rem] font-light text-[var(--text)]">
                {{
                  folderDetails?.updated
                    ? moment(folderDetails.updated * 1000).format('DD/MM/YYYY')
                    : '-'
                }}
              </p>
            </div>
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
