<template>
  <!-- actions -->
  <!-- upload progress bar -->
  <!-- uploading file indicator -->
  <div class="
      flex flex-row items-start
      bg-[var(--bg)]
      pt-10
      h-screen
      font-alexandria
    ">
    <div class="
      flex flex-col items-start
      px-0  pt-0 w-full h-full
      sm:px-8 sm:pt-6">
      <!-- search box movil-->
      <div
        v-if="!hideBar"
        class="
          fixed top-10 z-20
          flex flex-col justify-center
          w-full px-2 pt-4
          bg-[var(--bg)]

          sm:hidden
        "
      >
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
      <label
        v-if="!hideBar"
        for="fileInputBtn"
        class="
          hidden sm:flex items-center
          bg-[var(--color-primary)]
          text-white text-sm font-medium
          py-1 px-3
          rounded-full

          hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
          transition-all duration-300 ease-in-out
          cursor-pointer
        "
      >
        <img src="/icon/icon-upload.svg" alt="icon" class="h-4 mr-2" />
        <span>Upload</span>

        <input
          id="fileInputBtn2"
          type="file"
          class="hidden"
          ref="fileInputBtn2"
          @change="uploadFile"
          :multiple="true"
        />
      </label>

      <!--uploap movil-->
      <Transition name="fab">
        <label
          v-show="showFab"
          for="fileInputBtn"
          class="
            fixed z-50 bottom-3 right-3 sm:hidden
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
          "
        >
          <img src="/icon/icon-upload.svg" alt="icon" class="h-8 w-8" />

          <input
            id="fileInputBtn"
            type="file"
            class="hidden"
            ref="fileInputBtn"
            @change="uploadFile"
            :multiple="true"
          />
        </label>
      </Transition>

      <div
        class="
          w-full min-h-[calc(100vh-8rem)]
          mx-auto px-2 mt-4 rounded-2xl"
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
  onBeforeUnmount,
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
const uploading = ref(false);
const file = ref<File | null>(null);
const uploadQueue = ref<File[]>([]);
const isDragging = ref(false); // Drag & Drop
const fileInputBtn = ref<HTMLInputElement | null>(null);
const fileInputBtn2 = ref<HTMLInputElement | null>(null);
const showFab = ref(true); // Show FAB on mobile

const progress = computed<number>(() => store.state.files.uploadProgress);
const filesLength = computed<number>(() => store.state.files.result.data.length);
const hideBar = computed(() => route.path.includes('/details'));

let lastScroll = 0;

const handleScroll = () => {
  const current = window.scrollY;
  const threshold = 10; // Minimum scroll distance to trigger show/hide
  const offset = 100;

  if (current <= offset) {
    showFab.value = true;
  } else if (current > lastScroll + threshold) {
    showFab.value = false;
  } else if (current < lastScroll - threshold) {
    showFab.value = true;
  }

  lastScroll = current;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

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
  } catch (err: unknown) {
    const errorResponse = err as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al cargar los archivos';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

// Upload multiple files in a single request
async function uploadFile(ev: Event): Promise<void> {
  const target = ev.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) {
    return;
  }

  // Convert FileList to array
  const filesArray = Array.from(target.files);
  uploadQueue.value = filesArray;
  uploading.value = true;
  // Show first file name for display purposes
  [file.value] = filesArray;

  try {
    const formData = new FormData();
    // Append all files to FormData (most backends accept multiple files with same field name)
    filesArray.forEach((fileItem) => {
      formData.append('file', fileItem);
    });

    await store.dispatch('files/upload', formData);
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al subir los archivos';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    // Clean both file inputs
    if (fileInputBtn.value) {
      fileInputBtn.value.value = '';
    }
    if (fileInputBtn2.value) {
      fileInputBtn2.value.value = '';
    }
    // Reset state
    file.value = null;
    uploadQueue.value = [];
    uploading.value = false;
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

  const droppedFiles = Array.from(ev.dataTransfer.files);
  if (droppedFiles.length === 0) return;

  const fakeEvent = {
    target: { files: ev.dataTransfer.files },
  } as unknown as Event;

  await uploadFile(fakeEvent);
}

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

// Reset progress when individual file upload completes
watch(
  () => progress.value,
  (newProgress) => {
    if (newProgress === 1 && uploading.value && file.value) {
      // Progress is handled in uploadFile function for multiple files
      // This watch is kept for single file compatibility
    }
  },
);
</script>

<style scoped>
  .fab-enter-active,
  .fab-leave-active {
    transition: all 0.3s ease;
  }

  .fab-enter-from,
  .fab-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
