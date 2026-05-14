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

      <!-- actions desktop-->
      <div class="flex items-center w-full gap-2 px-8">
        <label
          v-if="!hideBar"
          for="fileInputBtn"
          class="
            hidden items-center
            bg-[var(--color-primary)]
            border border-[var(--color-primary)]
            text-white text-md font-medium
            px-2 py-0.5
            rounded-full

            sm:flex
            hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-upload.svg" alt="icon" class="h-6 mr-2 invert brightness-0" />
          <span>Upload</span>
        </label>

        <button
          v-if="!hideBar"
          @click="createFolderModal = true"
          class="
            hidden items-center
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            text-[var(--text-terceary)] text-md font-medium
            pl-2 pr-2.5 py-0.5
            grayscale
            rounded-full

            sm:flex
            hover:grayscale-0
            hover:text-[var(--text)]
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            focus:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-new-folder.svg" alt="icon" class="h-6 mr-2" />
          New folder
        </button>
        <button
          v-if="!hideBar"
          @click="createGroupModal = true"
          class="
            hidden items-center
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            text-[var(--text-terceary)] text-md font-medium
            pl-2 pr-2.5 py-0.5
            rounded-full

            sm:flex
            hover:text-[var(--text)]
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            transition-all duration-300 ease-in-out
            cursor-pointer
            relative
            group
          "
        >
          <img
            src="/icon/icon-isle.svg"
            alt="icon"
            class="h-6 mr-2 grayscale group-hover:grayscale-0 transition-all duration-300"
          />
          <span class="grayscale group-hover:grayscale-0 transition-all duration-300">New island</span>
          <span class="absolute -top-2 -right-6 text-xs px-2 text-white bg-[var(--color-primary)] rounded-full">beta</span>
        </button>
        <button
          v-if="!hideBar"
          @click="scanModal = true"
          class="
            hidden items-center
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            text-[var(--text-terceary)] text-sm font-medium
            pl-2 pr-2.5 py-0.5
            grayscale
            rounded-full

            sm:hidden
            hover:grayscale-0
            hover:text-[var(--text)]
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            focus:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-upload.svg" alt="icon" class="h-5 mr-2" />
          Scan document
        </button>
      </div>

      <FabMenu
        :currentFolderId="folderResults?.current?.id || null"
        @scan="scanModal = true"
        @createFolder="createFolderModal = true"
        @createGroup="createGroupModal = true"
      />

      <router-view></router-view>

    </div>
  </div>

  <Modal v-model="createFolderModal" size="xs">
    <template #header>
      New folder
    </template>
    <template #content>
      <div class="my-4">
        <form @submit.prevent="createFolder" id="create-folder-form">
          <label for="folder-name"></label>
          <img
            src="/icon/icon-folder.svg"
            alt="icon"
            class="h-5 mt-[1px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="folderName"
            type="text"
            placeholder="Folder name"
            id="folder-name"
            class="
              w-full border
              border-[var(--border)] bg-[var(--bg)]
              text-sm text-[var(--text)]
              my-2 pl-8 py-1
              rounded-full

              placeholder:text-[var(--text-terceary)]
              placeholder:font-light
              placeholder:text-sm

              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

              focus:border-[var(--color-primary)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300 ease-in-out
            "
            name="folder-name"
          />
        </form>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="createFolderModal = false"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full
          px-3

          hover:border-[var(--text)]
          hover:bg-[var(--hover-bg-gray)]
          hover:text-[var(--text)]
        ">
        Cancel
      </button>
      <button
        type="submit"
        form="create-folder-form"
        :disabled="!folderName || !folderName.trim()"
        class="
          text-[var(--text)] text-sm
          border
          rounded-full
          px-3
          transition
        "
        :class="!folderName || !folderName.trim()
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
      >
        Create
      </button>
    </template>
  </Modal>

  <Modal v-model="createGroupModal" size="xs">
    <template #header>
      New group
    </template>
    <template #content>
      <div class="my-4">
        <form @submit.prevent="createGroup" id="create-group-form">
          <label for="group-name"></label>
          <img
            src="/icon/icon-folder.svg"
            alt="icon"
            class="h-5 mt-[1px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="groupName"
            type="text"
            placeholder="Group name"
            id="group-name"
            class="
              w-full border
              border-[var(--border)] bg-[var(--bg)]
              text-sm text-[var(--text)]
              my-2 pl-8 py-1
              rounded-full

              placeholder:text-[var(--text-terceary)]
              placeholder:font-light
              placeholder:text-sm

              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

              focus:border-[var(--color-primary)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300 ease-in-out
            "
            name="group-name"
          />
        </form>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="createGroupModal = false"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full
          px-3

          hover:border-[var(--text)]
          hover:bg-[var(--hover-bg-gray)]
          hover:text-[var(--text)]
        ">
        Cancel
      </button>
      <button
        type="submit"
        form="create-group-form"
        :disabled="!groupName || !groupName.trim()"
        class="
          text-[var(--text)] text-sm
          border
          rounded-full
          px-3
          transition
        "
        :class="!groupName || !groupName.trim()
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
      >
        Create
      </button>
    </template>
  </Modal>

  <ScanModal v-model="scanModal" :currentFolderId="folderResults?.current?.id || null" />

</template>

<script setup lang="ts">
import {
  ref,
  defineAsyncComponent,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import { FileI } from '@/store/files/state';
import { FoldersResultI } from '@/store/folders/state';

const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));
const ScanModal = defineAsyncComponent(() => import('@/components/global/scan-modal.vue'));
const FabMenu = defineAsyncComponent(() => import('@/components/global/fab-menu.vue'));

const route = useRoute();
const router = useRouter();
const store = useStore();

let searchTimeout: number | undefined;

const query = ref<string>('');
const loading = ref(false);

const createFolderModal = ref(false);
const folderName = ref('');
const createGroupModal = ref(false);
const groupName = ref('');
const moveToFolderModal = ref(false);
const scanModal = ref(false);

const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolder = ref<number | string | null>(null);
const progress = computed<number>(() => store.state.files.uploadProgress);
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const hideBar = computed(() => route.path.includes('/details'));
const showSidebar = computed(() => showSidebarState.value);

const toggleSidebar = () => {
  store.commit('toggleSidebar');
};

async function createFolder() {
  // test folder name
  if (!folderName.value) {
    store.commit('notifications/addNotification', {
      message: 'Folder name is required',
      type: 'error',
    });
    return;
  }
  // strip folder name
  const strippedFolderName = folderName.value.trim();
  loading.value = true;
  try {
    await store.dispatch('folders/createFolder', { name: strippedFolderName, folderId: null });
    createFolderModal.value = false;
    folderName.value = '';
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al crear la carpeta';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

function createGroup() {
  const name = groupName.value.trim();
  if (!name) return;

  const saved = localStorage.getItem('folderGroups');
  let groups = saved ? JSON.parse(saved) : [];

  if (!Array.isArray(groups)) {
    groups = [];
  }

  const nextId = groups.length > 0 ? Math.max(...groups.map((g: any) => g.id)) + 1 : 1;

  groups.push({ id: nextId, name, folderIds: [] });
  localStorage.setItem('folderGroups', JSON.stringify(groups));
  window.dispatchEvent(new Event('folder-groups-updated'));

  createGroupModal.value = false;
  groupName.value = '';
}

async function handleSearch() {
  const payload = {
    page: 1,
    q: query.value,
  };

  await store.dispatch('files/filter', payload);
  router.replace({
    query: {
      ...payload,
    },
  });

  router.push({
    path: '/app/search',
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

async function handleSelectFolder(ev: Event) {
  const target = ev.target as HTMLSelectElement;
  selectedFolder.value = target.value;
}

async function moveToFolder() {
  if (!selectedFolder.value) {
    return;
  }

  try {
    loading.value = true;
    await store.dispatch('files/moveFilesToFolder', selectedFiles.value);
    moveToFolderModal.value = false;
    selectedFolder.value = null;

    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      orderBy: 'created',
      order: 'desc',
      folderId: '',
    });
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al mover los archivos';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    loading.value = false;
  }
}

</script>
