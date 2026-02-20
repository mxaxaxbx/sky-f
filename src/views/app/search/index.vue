<template>
  <div class="mx-2 sm:mx-14">
    <h1 class="text-lg mt-8 sm:mt-0 font-semibold mb-4 ml-2 text-[var(--text)] hidden sm:block">
      Search Results
      <span v-if="searchQuery" class="text-sm font-normal text-[var(--text-terceary)]">
        for "{{ searchQuery }}"
      </span>
    </h1>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-[var(--text)]"></i>
    </div>

    <!-- if no results -->
    <div v-else-if="!folders.length && !files.length" class="flex flex-col justify-center items-center py-20">
      <i class="fas fa-search text-4xl text-[var(--text-terceary)] mb-4"></i>
      <p class="text-[var(--text-terceary)] text-lg">No results found</p>
      <p class="text-[var(--text-terceary)] text-sm mt-2" v-if="searchQuery">
        Try searching with different keywords
      </p>
    </div>

    <!-- results -->
    <div v-else>
      <!-- folders -->
      <div v-if="folders.length" class="w-full my-4">
        <h3 class="font-semibold text-xs sm:text-sm truncate text-left mb-2 text-[var(--text)]">
          Folders ({{ folders.length }})
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="
              w-64
              border border-[var(--border)]
              rounded-2xl p-2
              flex items-center justify-between
              hover:border-[var(--color-primary)]
              transition-colors duration-300
            "
          >
            <router-link
              :to="`/app/folders/${folder.id}`"
              class="
                flex items-center
                space-x-2
                min-w-0 w-full overflow-hidden
              "
            >
              <i class="fas fa-folder text-[var(--color-primary)] text-xl"></i>
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-xs sm:text-sm truncate text-left text-[var(--text)]">
                  {{ folder.name }}
                </h3>
                <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                  {{ moment(folder.created * 1000).format('DD/MM/YY HH:mm') }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- files -->
      <div v-if="files.length" class="w-full my-4">
        <h3 class="font-semibold text-xs sm:text-sm truncate text-left mb-2 text-[var(--text)]">
          Files ({{ files.length }})
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="file in files"
            :key="file.id"
            class="
              w-64
              border border-[var(--border)]
              rounded-2xl p-2
              flex items-center justify-between
              hover:border-[var(--color-primary)]
              transition-colors duration-300
            "
          >
            <router-link
              :to="`/app/files/details/${file.id}`"
              class="
                flex items-center
                space-x-2
                min-w-0 w-full overflow-hidden
              "
            >
              <div
                class="
                  flex items-center
                  space-x-2
                  min-w-0 w-full overflow-hidden
                "
              >
                <!-- icons -->
                <img
                  v-if="file.contentType === 'application/pdf'"
                  src="/icon/icon-pdf.svg"
                  alt="PDF file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/msword' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  "
                  src="/icon/icon-doc.svg"
                  alt="Word file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-excel' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  "
                  src="/icon/icon-excel.svg"
                  alt="Excel file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-powerpoint' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  "
                  src="/icon/icon-ppt.svg"
                  alt="PowerPoint file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
                  src="/icon/icon-png.svg"
                  alt="image file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="file.contentType === 'image/svg+xml'"
                  src="/icon/icon-svg.svg"
                  alt="SVG file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
                  src="/icon/icon-img.svg"
                  alt="image file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="/^video\//.test(file.contentType)"
                  src="/icon/icon-video.svg"
                  alt="video file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="file.contentType === 'application/zip'"
                  src="/icon/icon-zip.svg"
                  alt="ZIP file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else-if="/^audio\//.test(file.contentType)"
                  src="/icon/icon-audio.svg"
                  alt="audio file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <img
                  v-else
                  src="/icon/icon-file.svg"
                  alt="file icon"
                  class="h-10 w-10 flex-shrink-0"
                />
                <!-- title and date -->
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-xs sm:text-sm truncate text-left text-[var(--text)]">
                    {{ file.name }}
                  </h3>
                  <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                    {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} - {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import moment from 'moment';

import { SearchResultI } from '@/store/files/state';

const store = useStore();
const route = useRoute();

const searchResult = computed<SearchResultI>(() => store.state.files.searchResult);
const loading = ref(false);

const searchQuery = computed(() => (
  typeof route.query.q === 'string' ? route.query.q : ''
));

// Separate folders and files
const folders = computed(() => (
  searchResult.value.data.filter((item) => item.itemType === 'folder')
));

const files = computed(() => (
  searchResult.value.data.filter((item) => item.itemType === 'file')
));

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

async function getSearchResult() {
  const q = typeof route.query.q === 'string' ? route.query.q : '';
  if (!q) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    await store.dispatch('files/search', {
      q,
      page: 1,
    });
  } finally {
    loading.value = false;
  }
}

// Watch for route query changes
watch(() => route.query.q, () => {
  getSearchResult();
});

onMounted(() => {
  getSearchResult();
});
</script>
