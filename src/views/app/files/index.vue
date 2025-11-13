<template>
  <!-- actions -->
  <!-- upload progress bar -->
  <!-- uploading file indicator -->
  <div v-if="loading" class="
      fixed
      bottom-4 right-4 z-50
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
      bg-white
      pt-10 sm:pt-14
      h-screen
      font-alexandria
    ">
    <!--files sidebar-->
    <div class="hidden sm:flex w-[300px] h-full bg-[#EDF5FF] pt-4">
      <router-link to="/app/files" class="
        flex items-center
        bg-[#ffffff]
        h-8 w-full
        pl-8
        py-6
        text-lg font-semibold text-[#3d3d3d] font-Alexandria
        border-l-4 border-white
        hover:border-l-4 hover:border-[#0A77F3]
        ">
        <img src="/icon/icon-cloudDrive.svg" alt="icon" class="h-6 mr-3" />
        Cloud drive
      </router-link>
    </div>
    <!--right side -->
    <div class="
        flex-1 flex flex-col items-start
        h-full
        px-0 sm:px-8 pt-0 sm:pt-6">
      <!-- search box movil-->
      <div
        v-if="!isAuth"
        class="flex items-center justify-center
          w-full h-10 mt-6 px-2 block sm:hidden">
        <label
          for="search"
          class="text-[#a3a3a3]"></label>

        <!-- Contenedor relativo -->
        <div class="relative w-full">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search everything"
            class="
              w-full
              border border-[#0B77F3]/50
              rounded-full font-light text-xs
              pl-8 pr-4 py-1
              hover:border-[#0A77F3]
              focus:ring-1 focus:ring-[#0A77F3]
              focus:outline-none
              transition-all duration-300
            " />

          <!-- Ícono dentro del input -->
          <img src="/icon/icon-search.svg" alt="Search Icon"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-5 pointer-events-none" />
        </div>
      </div>
      <label for="fileInput" class="
          hidden sm:flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          py-2 px-4
          rounded-full
          cursor-pointer
          hover:ring-4 hover:ring-[#0B77F3]/50
          focus:ring-4 focus:ring-[#0B77F3]/50
          transition-all duration-300 ease-in-out
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
          :disabled="loading" />
      </label>

      <!--uploap movil-->
      <label for="fileInput" class="
          fixed bottom-3 left-3 sm:hidden
          flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          shadow-sm
          py-2 px-2
          rounded-full
          cursor-pointer
          hover:ring-4 hover:ring-[#0B77F3]/50
          focus:ring-4 focus:ring-[#0B77F3]/50
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
        class=" mt-2 w-full px-2"
        :class="[
        isDragging ?
        'border-2 rounded-lg border-dashed border-[#0A77F3] bg-[#F0F7FF]' : '',
      ]" @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop">
        <DragDrop v-if="filesLength === 0" :loading="loading" />

        <router-view v-else></router-view>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { PaginationI } from '@/store/state';

const DragDrop = defineAsyncComponent(() => import('@/components/app/dragdrop.vue'));

const route = useRoute();
const store = useStore();

const progress = computed<number>(() => store.state.files.uploadProgress);
const filesLength = computed<number>(() => store.state.files.result.data.length);
// const filesLength = ref<number>(0);

const loading = ref(false);
const file = ref<File | null>(null);

const isDragging = ref(false); // Drag & Drop

// TODO: move to the vuex store
const find = ref<PaginationI>({
  page: 1,
  limit: 10,
  query: '',
});

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
    // currentPage.value = Number(route.query.page) || 1;
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

onMounted(() => {
  // find.value.page = Math.max(route.query.page ? Number(route.query.page) : 1, 1);
  // find.value.query = route.query.query ? String(route.query.query) : '';
  getData();
});

watch(route, () => {
  // find.value.page = Math.max(route.query.page ? Number(route.query.page) : 1, 1);
  // find.value.query = route.query.query ? String(route.query.query) : '';
  getData();
});

</script>
