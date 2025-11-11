<template>
  <div>
    <!-- list -->
    <div class="px-3 py-5 bg-white">
      <!-- title -->
      <!-- <h2 class="font-bold"> Lista de docentes </h2> -->
      <div class="border-t border-gray-400 my-2 mb-5"></div>
      <!-- search box -->
      <div class="flex items-center mb-5 relative w-full">
        <label for="search" class="text-[#a3a3a3] hidden"></label>

        <!-- Contenedor relativo -->
        <div class="relative w-full">
          <!-- Input -->
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

          <!-- Ícono dentro del input -->
          <img
            src="/icon/icon-search.svg"
            alt="Search Icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-6pointer-events-none"
          />
        </div>
      </div>

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
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6
          text-[#3d3d3d]
          ">
        <!-- results -->
        <button
          v-for="file in results.data"
          :key="file.id"
          @click="downloadFile(file)"
          class="border border-[#7DBAFF] rounded-lg p-4
            hover:bg-[#E9F3FF] transition-colors duration-300"
        >
          <div class="flex items center justify-between">
            <div
              class="
                flex items-center
                space-x-2
                font-regular
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
                class="w-8"
              />
              <img
                v-else-if="file.contentType === 'image/jpeg'"
                src="/icon/icon-img.svg"
                alt="image file icon"
                class="w-8"
              />
              <i
                v-else-if="file.contentType === 'image/jpg'"
                class="fas fa-file-image text-green-500 text-xl"
              ></i>
              <i
                v-else-if="file.contentType === 'video/mp4'"
                class="fas fa-file-video text-red-500 text-2xl"
              ></i>
              <i
                v-else-if="file.contentType === 'application/zip'"
                class="fas fa-file-archive text-yellow-500 text-2xl"
              ></i>
              <i
                v-else-if="file.contentType === 'audio/mpeg'"
                class="fas fa-file-audio text-yellow-500 text-2xl"
              ></i>
              <i v-else class="fas fa-file text-gray-500 text-2xl"></i>
              <!-- title -->
              <!-- loading icon -->
              <i
                v-if="file.loading"
                class="fas fa-spinner fa-spin text-2xl text-gray-500"
              ></i>
              <h3 class="font-semibold text-md">{{ file.name }}</h3>
            </div>
          </div>
        </button>
      </div>
      <!-- pages if data -->
      <div
        v-if="results.data.length > 0"
        class="flex space-x-1 justify-center items-center mt-5"
      >
        <!-- previous -->
        <router-link
          :to="getPaginatedLink('previous', Number(find.page))"
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
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
            class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            :class="page === currentPage ? 'bg-purple-700' : 'bg-purple-500'"
          >
            {{ page }}
          </router-link>

        </div>
        <!-- next -->
        <router-link
          :to="getPaginatedLink('next', Number(find.page))"
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
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
  onMounted,
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
  limit: 10,
  query: '',
});
const currentPage = ref(1);
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

async function getData() {
  loading.value = true;
  try {
    currentPage.value = Number(route.query.page) || 1;
    await store.dispatch('files/filter', find.value);
  } catch (err: any) {
    const msg = err.response.data.error || 'Error al cargar los archivos';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

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
    const msg = err.response.data.error || 'Error al descargar el archivo';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    // eslint-disable-next-line no-param-reassign
    file.loading = false;
  }
}

onMounted(() => {
  find.value.page = Math.max(route.query.page ? Number(route.query.page) : 1, 1);
  find.value.query = route.query.query ? String(route.query.query) : '';
  getData();
});

watch(route, () => {
  find.value.page = Math.max(route.query.page ? Number(route.query.page) : 1, 1);
  find.value.query = route.query.query ? String(route.query.query) : '';
  getData();
});

</script>
