<template>
  <div>
    <!-- list -->
    <div class="w-full pb-4 pt-0 px-0 mt-20 sm:mt-0 sm:pt-2 sm:px-3">
      <h1 class="text-lg mt-8 sm:mt-0 font-semibold mb-4 ml-2 text-[var(--text)] hidden sm:block">Could Drive</h1>

      <!-- loading -->
      <div v-if="loading" class="flex justify-center items-center">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
      <!-- if not results -->
      <div v-else-if="!results.data.length" class="flex justify-center items-center">
        <p class="text-gray-500">No hay resultados</p>
      </div>
      <!-- results -->
      <div
        class="
          grid grid-cols-2
          sm:grid-cols-2 lg:grid-cols-5 gap-4
          text-[var(--text)]
          ">
        <!-- results -->
        <div
          v-for="file in results.data"
          :key="file.id"
          class="
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            py-2 px-2
            rounded-2xl min-w-0
            hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)]
            hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
            transition-colors duration-300
            relative
            "
        >
          <router-link
            :to="`/app/files/details/${file.id}`"
            class="block"
          >
            <div class="flex items center justify-between">
              <div
                class="
                  flex items-center
                  space-x-4
                  text-xs
                  min-w-0 w-full overflow-hidden
                  ">
                <!-- icons -->
                <img
                  v-if="file.contentType === 'application/pdf'"
                  src="/icon/icon-pdf.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/msword' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  "
                  src="/icon/icon-doc.svg"
                  alt="Word file icon"
                  class="w-8"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-excel' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  "
                  src="/icon/icon-excel.svg"
                  alt="Word file icon"
                  class="w-8"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-powerpoint' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  "
                  src="/icon/icon-ppt.svg"
                  alt="PowerPoint file icon"
                  class="w-8"
                />
                <img
                  v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
                  src="/icon/icon-png.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="file.contentType === 'image/svg+xml'"
                  src="/icon/icon-svg.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
                  src="/icon/icon-img.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="/^video\//.test(file.contentType)"
                  src="/icon/icon-video.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="file.contentType === 'application/zip'"
                  src="/icon/icon-zip.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else-if="/^audio\//.test(file.contentType)"
                  src="/icon/icon-audio.svg"
                  alt="image file icon"
                  class="w-8"
                />
                <img
                  v-else
                  src="/icon/icon-file.svg"
                  alt="image file icon"
                  class="w-8"
                  />
                <!-- title and date -->
                <div class="mr-10">
                  <h3
                    class="
                      font-semibold text-xs text-left h-4
                      block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap
                      sm:text-md
                    "
                  >
                    {{ file.name }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ moment(file.created).format('DD/MM/YYYY HH:mm') }}
                  </p>
                </div>
              </div>
            </div>
          </router-link>
          <!-- options -->
          <div class="absolute top-2 right-2 z-10">
            <Dropdown width="sm:w-50">
              <template #trigger="{ toggle }">
                <button
                  @click="toggle"
                  class="
                    w-5 h-10
                    flex items-center justify-center
                    bg-red-500
                  "
                >
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </template>

              <template #content="{ }">
                <div class="bg-red-500 flex flex-col gap-2">
                  <!-- download -->
                  <button
                    @click="downloadFile(file)"
                    class="flex items-center justify-start"
                  >
                    <i class="fas fa-download"></i>
                    <span>Download</span>
                  </button>
                  <!-- details -->
                  <router-link
                    :to="`/app/files/details/${file.id}`"
                  >
                    <i class="fas fa-eye"></i>
                    <span>Details</span>
                  </router-link>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI, FilesResultI } from '@/store/files/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const results = computed<FilesResultI>(() => store.state.files.result);

const loading = ref(false);

async function getMoreResults() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 10) {
    const { page } = results.value;
    const query = typeof route.query.query === 'string' ? route.query.query : '';

    const { totalPages } = results.value;
    console.log('Loading more results...', page, totalPages);

    if (loading.value) {
      return; // Prevent multiple simultaneous loads
    }

    if (page >= totalPages) {
      return; // No more pages to load
    }

    loading.value = true;

    await store.dispatch('files/filter', {
      page: page + 1,
      query,
    });

    loading.value = false;
  }
}

async function downloadFile(file: FileI) {
  await store.dispatch('files/getDownloadUrl', file);
}

onMounted(() => {
  // when scrolling to bottom, load more results
  window.addEventListener('scroll', getMoreResults);
});

onUnmounted(() => {
  // TODO: validate pagination
  window.removeEventListener('scroll', getMoreResults);
});

</script>
