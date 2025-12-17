<template>
  <div>
    <!-- list -->
    <div class="px-0 sm:px-3 py-2 sm:py-5 w-full">
      <h1 class="text-ld font-semibold mb-4 ml-2 text-[var(--text)]">Could Drive</h1>
      <!-- title -->
      <!-- search box
      <div class="flex items-center mb-5 relative w-full">
        <label for="search" class="text-[#a3a3a3] hidden"></label>

        <div class="relative w-full">
          <input
            v-model="find.query"
            @keyup="search"
            type="text"
            placeholder="Search everything"
            class="
              w-full
              border border-[#0B77F3]/50
              rounded-full font-light
              pl-12 pr-4 p-2
              hover:border-[#0A77F3]
              focus:ring-1 focus:ring-[#0A77F3]
              focus:outline-none
              transition-all duration-300
            "
          />

          <img
            src="/icon/icon-search.svg"
            alt="Search Icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-6pointer-events-none"
          />
        </div>
      </div> -->

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
          text-[#3d3d3d]
          ">
        <!-- results -->
        <button
          v-for="file in results.data"
          :key="file.id"
          @click="downloadFile(file)"
          class="border border-[#7DBAFF] py-2 rounded-lg p-4
            hover:bg-[#E9F3FF] transition-colors duration-300"
        >
          <div class="flex items center justify-between">
            <div
              class="
                flex items-center
                space-x-2
                text-xs
                font-regular
                w-80
                ">
              <!-- icons -->
              <i
                v-if="file.contentType === 'application/pdf'"
                class="fas fa-file-pdf"
              ></i>
              <i
                v-else-if="file.contentType === 'application/msword'"
                class="fas fa-file-word"
              ></i>
              <img
                v-else-if="file.contentType === 'image/png'"
                src="/icon/icon-png.svg"
                alt="image file icon"
                class="w-6"
              />
              <img
                v-else-if="file.contentType === 'image/svg+xml'"
                src="/icon/icon-svg.svg"
                alt="image file icon"
                class="w-6"
              />
              <img
                v-else-if="file.contentType === 'image/jpeg'"
                src="/icon/icon-img.svg"
                alt="image file icon"
                class="w-6"
              />
              <img
                v-else-if="file.contentType === 'image/jpg'"
                src="/icon/icon-img.svg"
                alt="image file icon"
                class="w-6"
              />
              <img
                v-else-if="file.contentType === 'video/mp4'"
                src="/icon/icon-video.svg"
                alt="image file icon"
                class="w-6"
              />
              <i
                v-else-if="file.contentType === 'application/zip'"
                class="fas fa-file-archive text-yellow-500 text-2xl"
              ></i>
              <img
                v-else-if="file.contentType === 'audio/mpeg'"
                src="/icon/icon-audio.svg"
                alt="image file icon"
                class="w-6"
              />
              <i v-else class="fas fa-file text-gray-500 text-2xl"></i>
              <!-- title -->
              <!-- loading icon -->
              <i
                v-if="file.loading"
                class="fas fa-spinner fa-spin text-2xl text-gray-500"
              ></i>
              <h3
                class="
                font-semibold text-xs
                sm:text-md
                w-28
                text-ellipsis overflow-hidden whitespace-nowrap
                text-left">{{ file.name }}</h3>
            </div>
          </div>
        </button>
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
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { PaginationI } from '@/store/state';
import { FileI, FilesResultI } from '@/store/files/state';

const store = useStore();
const route = useRoute();
const router = useRouter();

const results = computed<FilesResultI>(() => store.state.files.result);

const loading = ref(false);

async function downloadFile(file: FileI) {
  // eslint-disable-next-line no-param-reassign
  file.loading = true;
  try {
    await store.dispatch('files/download', file);
  } catch (err: any) {
    const msg = err.response.data.error || 'Oops! Download didn’t go through. Try again?';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    // eslint-disable-next-line no-param-reassign
    file.loading = false;
  }
}

async function getMoreResults() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 10) {
    const page = typeof route.query.page === 'string' ? parseInt(route.query.page, 10) : 1;
    const query = typeof route.query.query === 'string' ? route.query.query : '';

    const currentPage = results.value.page;
    const { totalPages } = results.value;

    if (currentPage >= totalPages) {
      return; // No more pages to load
    }

    await store.dispatch('files/filter', {
      page: page + 1,
      query,
    });

    router.replace({
      query: {
        ...route.query,
        page: (page + 1).toString(),
      },
    });
  }
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
