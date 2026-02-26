<template>
  <div
    class="
      flex flex-row items-start
      bg-[var(--bg)]
      pt-10
      h-screen
      font-alexandria font-sans
    "
  >
    <div
      class="
        flex flex-col items-start
        px-0  pt-0 w-full h-full
        sm:pt-6
      "
    >
      <!-- folder details -->
      <div v-if="folderDetails && folderDetails.id" class="max-w-4xl mx-auto">
        <!-- Back button -->
        <button
          @click="$router.back()"
          class="
            flex items-center gap-2
            mb-4 ml-2 sm:mb-6 ml:0
            text-[var(--text-terceary)]
            hover:text-[var(--text)]
            transition-colors duration-200
          "
        >
          <i class="fas fa-arrow-left"></i>
          <span class="text-md font-regular">back</span>
        </button>
        <div
          class="
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            rounded-2xl
            shadow-lg
            p-4 sm:p-6
          "
        >
          <div class="flex items-center gap-3 mb-4">
            <img src="/icon/icon-folder.svg" alt="folder" class="h-8 w-8"/>
            <h2 class="text-xl sm:text-2xl font-semibold text-[var(--text)]">
              {{ folderDetails.name }}
            </h2>
          </div>

          <div
            class="
              grid grid-cols-1
              gap-3
              sm:grid-cols-2 sm:gap-6
            "
          >
            <!-- Created date -->
            <div class="px-3 py-2">
              <div class="flex-col items-center justify-between gap-2">
                <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
                  Creation date:
                </h3>
              </div>
              <p class="text-xl font-light text-[var(--text)]">
                {{ moment(folderDetails.created * 1000).format('DD/MM/YYYY HH:mm a') }}
              </p>
              <p class="text-sm font-light text-[var(--text-terceary)]">
                {{ moment(folderDetails.created * 1000).fromNow() }}
              </p>
            </div>

            <!-- Updated date -->
            <div class="px-3 py-2">
              <div class="flex-col items-center justify-between gap-2">
                <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
                  Last modification:
                </h3>
              </div>
              <p class="text-xl font-light text-[var(--text)]">
                {{ moment(folderDetails.updated * 1000).format('DD/MM/YYYY HH:mm a') }}
              </p>
              <p class="text-sm font-light text-[var(--text-terceary)]">
                {{ moment(folderDetails.updated * 1000).fromNow() }}
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

const store = useStore();
const route = useRoute();
const loading = ref(false);

const folderDetails = computed<FolderI>(() => store.state.folders.folder);
const folderId = computed<number>(() => Number(route.params.id as string));

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
