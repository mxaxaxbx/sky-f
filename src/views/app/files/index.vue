<template>
  <!-- actions -->
  <!-- upload progress bar -->
  <!-- uploading file indicator -->
  <div v-if="loading" class="
      fixed
      bottom-4 left-4 sm-right-4 z-50
      p-2
      rounded-lg
      border border-[#0A77F3]
      ">
    <div class="relative">
      <div class="flex items-center justify-between">
        <div>
          <span class="
              text-xs font-semibold uppercase
              inline-block
              py-1 px-2 mb-2
              rounded-full
              text-[#0A77F3]
              bg-white
            ">
            Subiendo archivo
          </span>
          <span class="text-xs font-semibold inline-block text-[#0A77F3]">
            {{ file?.name }}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block mb-2 text-[#0A77F3]">
            {{ Math.round(100 * progress) }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#7DBAFF]">
        <div :style="{ width: `${Math.round(100 * progress)}%` }" class="
            shadow-none
            flex flex-col
            text-center whitespace-nowrap text-white
            justify-center
            bg-[#0A77F3]
          "></div>
      </div>
    </div>
  </div>

  <div class="
      flex flex-row items-start
      bg-[var(--bg)]
      pt-10
      h-screen
      font-alexandria
    ">
    <!--right side -->
    <div class="
      flex flex-col items-start
      px-0  pt-0
      sm:px-8 sm:pt-6">
      <!-- search box movil-->
      <div
        v-if="!isAuth"
        class="
          fixed top-10
          flex flex-col justify-center
          w-full px-2 pt-4
          bg-[var(--bg)]

          sm:hidden ">
        <label
          for="search"
          class="text-[#a3a3a3]"></label>

        <!-- Contenedor relativo -->
        <form @submit.prevent="handleSearch" class="relative w-full">
          <!-- Input -->
          <input
            v-model="query"
            @input="handleInput"
            type="text"
            placeholder="Search everything"
            class="
              w-full
              pl-8 pr-4 py-1
              bg-[var(--bg-secondary)]
              border border-[#0B77F3]/50
              rounded-full
              font-light text-[var(--text)] text-xs

              hover:shadow-[0_0_2px_2px_rgba(10,119,243,0.5)]
              hover:border-[var(--hover-border)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300
            "/>

          <!-- Ícono dentro del input -->
          <img src="/icon/icon-search.svg" alt="Search Icon"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-5 pointer-events-none" />
        </form>
        <h1 class="text-left text-lg mt-4 mb-1 font-semibold ml-2 text-[var(--text)]
        ">Could Drive</h1>
      </div>
      <label for="fileInput" class="
          hidden sm:flex items-center
          bg-[var(--color-primary)]
          text-white text-sm font-medium
          py-1 px-3
          rounded-full

          hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          transition-all duration-300 ease-in-out
          cursor-pointer
        " :class="{ 'opacity-50': loading }">
        <img src="/icon/icon-upload.svg" alt="icon" class="h-4 mr-2" />
        <span>Upload</span>

        <input
          id="fileInput"
          type="file"
          class="hidden"
          ref="fileInput"
          @change="uploadFile"
          :multiple="false"
          :disabled="loading" />
      </label>

      <!--uploap movil-->
      <label for="fileInput" class="
          fixed bottom-3 right-3 sm:hidden
          flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          shadow-sm
          py-2 px-2
          rounded-full
          cursor-pointer

          hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          transition-all duration-300 ease-in-out
        " :class="{ 'opacity-50': loading }">
        <img src="/icon/icon-upload.svg" alt="icon" class="h-8 w-8" />

        <input
          id="fileInput"
          type="file"
          class="hidden"
          ref="fileInput"
          @change="uploadFile"
          :multiple="false"
          :disabled="loading" />
      </label>

      <div
        class="
          w-full min-h-[calc(100vh-8rem)]
          mx-auto px-2 mt-4 rounded-lg"
        :class="[
        isDragging ?
        'border-2 border-[var(--hover-border)] border-dashed bg-[var(--hover-bg)] ' : '',
      ]" @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop">
        <DragDrop v-if="filesLength === 0  && query === '' " :loading="loading" />

        <router-view v-else></router-view>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  defineAsyncComponent,
  computed,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const DragDrop = defineAsyncComponent(() => import('@/components/app/dragdrop.vue'));

const route = useRoute();
const router = useRouter();
const store = useStore();
let searchTimeout: number | undefined;
let timeout: number | undefined;

const query = ref<string>('');
const loading = ref(false);
const file = ref<File | null>(null);
const isDragging = ref(false); // Drag & Drop

const progress = computed<number>(() => store.state.files.uploadProgress);
const filesLength = computed<number>(() => store.state.files.result.data.length);
const isLight = computed(() => store.state.theme.theme === 'light');

async function handleSearch() {
  const payload = {
    page: 1,
    query: query.value,
  };

  await store.dispatch('files/filter', payload);
  router.replace({
    query: {
      ...payload,
    },
  });
}

async function handleInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500);
}

// Lógica original de subida (sin cambios)
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

function onDragEnter(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = true;
}

function onDragOver(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = true;
}

function onDragLeave(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = false;
}

async function onDrop(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = false;

  if (!ev.dataTransfer || !ev.dataTransfer.files.length) return;

  const droppedFile = ev.dataTransfer.files[0];
  if (!droppedFile) return;

  const fakeEvent = {
    target: { files: [droppedFile] },
  } as unknown as Event;

  await uploadFile(fakeEvent);
}

async function getData() {
  loading.value = true;
  try {
    const q = typeof route.query.query === 'string' ? route.query.query : '';
    const payload = {
      query: q,
      page: 1,
    };
    query.value = q;
    await store.dispatch('files/filter', payload);
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
const toggleTheme = () => {
  store.dispatch('theme/toggleTheme');
  const newTheme = store.state.theme.theme;

  document.documentElement.classList.toggle('light', newTheme === 'light');
};

onMounted(() => {
  // find.value.page = Math.max(route.query.page ? Number(route.query.page) : 1, 1);
  // find.value.query = route.query.query ? String(route.query.query) : '';
  getData();
});

watch(
  () => query.value,
  () => {
    if (timeout) clearTimeout(timeout);

    timeout = window.setTimeout(() => {
      handleSearch();
    }, 500);
  },
);
</script>
