<template>
  <div>
    <!-- list -->
    <div class="px-0 sm:px-3 py-2 sm:py-5 w-full">
      <h1 class="text-ld font-semibold mb-4 ml-2 text-[#3d3d3d]">Could Drive</h1>
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
      <!-- pages if data -->
      <div
        v-if="results.data.length > 0"
        class="flex space-x-1 justify-center text-xs items-center mt-5"
      >
        <!-- previous -->
        <router-link
          :to="getPaginatedLink('previous', Number(find.page))"
          class="bg-purple-500 hover:bg-purple-700 text-white font-light py-2 px-2 rounded-full"
        >
          <i class="fas fa-chevron-left"></i>
        </router-link>
        <!-- pages only show 5 around the current page -->
        <div v-for="page in results.totalPages" :key="page">
          <router-link
            :to="getPaginatedLink('page', page)"
            v-if="
              Math.abs(page - currentPage) < 2 || page === 1 || page === results.totalPages
            "
            class="bg-purple-500 hover:bg-purple-700 text-white font-light py-2 px-2 rounded-full"
            :class="page === currentPage ? 'bg-purple-700' : 'bg-purple-500'"
          >
            {{ page }}
          </router-link>

        </div>
        <!-- next -->
        <router-link
          :to="getPaginatedLink('next', Number(find.page))"
          class="bg-purple-500 hover:bg-purple-700 text-white font-light py-2 px-2 rounded-full"
        >
          <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
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
const find = ref<PaginationI>({
  page: 1,
  limit: 20,
  query: '',
});
const currentPage = ref(1);
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

function getPaginatedLink(action: string, page?: number) {
  const query = route.query.query || '';
  switch (action) {
    case 'previous':
      return `/app/files?page=${Math.max(1, Number(find.value.page) - 1)}&query=${query}`;
    case 'next':
      return `/app/files?page=${Math.min(
        results.value.totalPages,
        Number(find.value.page) + 1,
      )}&query=${query}`;
    default:
      return `/app/files?page=${page}&query=${query}`;
  }
}

function search(ev: KeyboardEvent) {
  ev.preventDefault();

  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    router.push({
      query: {
        page: 1,
        query: find.value.query,
      },
    });
  }, 1000);
}

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

</script>
