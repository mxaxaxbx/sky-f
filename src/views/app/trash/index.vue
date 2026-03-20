<template>
  <!-- loading -->
  <div v-if="loading" class="flex mx-auto justify-center items-center py-20 text-[var(--color-primary)]">
    <i class="fas fa-spinner fa-spin text-2xl"></i>
  </div>

  <!-- empty state -->
  <div v-else-if="!folders.length && !files.length" class="px-8 mx-auto w-full h-full mt-4">
    <div
      class="
        flex flex-col gap-6 justify-center items-center
        w-full h-[calc(100vh-120px)]
        border-2 border-[var(--text-terceary)] border-dashed
        rounded-2xl
        hover:border-[var(--color-primary)]
        transition-colors duration-300
      "
    >
      <i class="fas fa-trash-can text-6xl text-[var(--text-terceary)]"></i>
      <p class="text-[var(--text-terceary)] text-center text-2xl font-regular">
        The void is empty. Nothing to delete here.
      </p>
    </div>
  </div>

  <template v-else>
    <div class="mt-10 border border-transparent">
      <h1
      class="
        text-xl text-[var(--text)] font-semibold
        mx-2 my-2 px-12 font-alexandria

        sm:mt-8
        hidden sm:block
      "
    >
      Horizon Events
    </h1>
    <p class="mx-2 mt-8 px-12 text-sm text-[var(--text-terceary)] font-light">
      Deleted files don’t disappear right away: you have 30 days to restore them.
      Then they’re permanently removed.
    </p>

    <!-- bulk actions bar -->
    <transition
      enter-active-class="animate__animated animate__fadeInDown animate__faster"
      leave-active-class="animate__animated animate__fadeOutUp animate__faster"
    >
      <div
        v-if="selectedIds.size > 0"
        class="
          flex items-center gap-12
          mt-8 px-14 py-3
          border-b border-[var(--border)]

        "
      >
        <div class="flex gap-2">
          <span class="text-md font-medium text-[var(--text)] mr-auto">
            {{ selectedFiles.length + selectedFolders.length }} <span class="ml-1">selected:</span>
          </span>
          <!-- clear selection -->
          <button
            @click="clearSelection"
            class="
              text-xs text-[var(--text-terceary)] w-6 h-6
              rounded-full border border-transparent
              hover:border-[var(--color-primary)] hover:text-[var(--text)]
              hover:bg-[var(--hover-bg)]
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]
              transition-all duration-300
            "
          >
            <i class="fas fa-xmark m-1.5" />
          </button>
          <span class="text-md font-medium text-[var(--text)] mr-auto">
            {{ selectedFiles.length + selectedFolders.length }} <span class="">selected:</span>
          </span>
        </div>
        <div class="flex gap-2">
          <!-- recover selected -->
          <button
            :disabled="loading"
            @click="recoverSelected"
            class="
              flex items-center gap-2
              px-2 py-0.5
              text-s font-medium
              rounded-full border
              text-[var(--color-primary)]
              border-[var(--color-primary)]
              bg-[var(--bg-secondary)]
              grayscale

              hover:border-[var(--color-primary)]
              hover:bg-[var(--hover-bg)]
              hover:opacity-100 hover:grayscale-0
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]
              focus:grayscale-0 focus:opacity-100
              transition-all duration-300
              disabled:opacity-40
            "
          >
            <img src="/icon/icon-recover.svg" alt="recover" class="h-5" />
            Recover
          </button>

          <!-- delete selected -->
          <button
            :disabled="loading"
            @click="confirmDeleteSelected"
            class="
              flex items-center gap-2
              px-2.5 py-0.5
              text-s font-medium
              rounded-full border
              text-[var(--warning-border)]
              border-[var(--warning-border)]
              bg-[var(--bg-secondary)]
              grayscale opacity-60

              hover:border-[var(--warning-border)]
              hover:bg-[var(--warning-bg)]
              hover:opacity-100 hover:grayscale-0
              hover:shadow-[0_0_5px_2px_rgba(255,166,0,0.3)]
              focus:grayscale-0 focus:opacity-100
              transition-all duration-300
              disabled:opacity-40
            "
          >
            <img src="/icon/icon-delate.svg" alt="delate" class="h-5"/>
            Delete permanently
          </button>
        </div>
      </div>
    </transition>

    <!-- folders section -->
    <div
      v-if="folders.length"
      class="w-full border-b border-[var(--border)] py-0 px-2 pt-4 sm:py-4 sm:px-14"
    >
      <h3
        class="
          flex items-center
          font-regular text-left text-sm text-[var(--text-terceary)] truncate
          mb-1 gap-2
          sm:text-lg sm:mb-0 sm:font-semibold
        "
      >
        <span>Folders</span>
        <button
          type="button"
          @click="showFolders = !showFolders"
          class="
            text-xs rounded-xl p-1 border border-transparent mt-0.5
            hover:border-[var(--color-primary)]
            hover:text-[var(--color-primary)]
            focus:outline-none
            transition-all duration-300"
          :class="showFolders ? 'text-[var(--color-primary)]' : 'grayscale'"
        >
          <img :src="showFolders ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'" alt="eye icon" class="h-5" />
        </button>
      </h3>

      <Transition name="slide">
        <div
          v-show="showFolders"
          class="
            grid grid-cols-2 gap-2 mx-0
            text-[var(--text)] my-4
            sm:grid-cols-2 sm:gap-4 sm:my-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
            transition-all duration-300
          "
        >
          <button
            v-for="folder in folders"
            :key="folder.id"
            @click="toggleSelect(folder, 'folder')"
            class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              cursor-pointer
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              transition-all duration-300
            "
            :class="selectedFolders.some((f: FolderI) => f.id === folder.id)
              ? 'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]'
              : 'border-[var(--border)]'
            "
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between p-1">
                <div class="flex items-center space-x-2 min-w-0 w-full overflow-hidden">
                  <!-- checkbox -->
                  <label for="folder-{{ folder.id }}"></label>
                  <input
                    type="checkbox"
                    :checked="selectedFolders.some((f: FolderI) => f.id === folder.id)"
                    @click.stop
                    @change="toggleSelect(folder, 'folder')"
                    class="w-3.5 h-3.5 rounded accent-[var(--color-primary)] flex-shrink-0 ml-1 cursor-pointer"
                  />
                  <img src="/icon/icon-folder.svg" alt="folder" class="h-8 flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
                      {{ folder.name }}
                    </h3>
                    <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                      {{ formatDate(folder.updated) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- actions -->
            <div
              class="
                flex items-center justify-center
                border-l border-[var(--border)]
                w-6 py-2
                group-hover:border-[var(--color-primary)]
                transition-colors duration-300
              "
            >
              <Dropdown
                :classes="[
                  'bg-[var(--bg-secondary)]',
                  'border border-[var(--border)]',
                  'rounded-2xl',
                  'absolute', '-right-0', 'z-20',
                  dropdownPosition,
                  'w-52',
                  'sm:-right-2'
                ]"
              >
                <template #trigger="{ toggle }">
                  <button
                    @click.stop="toggleDropdown(toggle, $event)"
                    class="
                      text-[var(--text-terceary)] w-6 h-auto
                      hover:text-[var(--text)]
                      transition-colors duration-300
                    "
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </template>

                <template #content>
                  <div class="flex flex-col gap-0.5 px-1 py-1 font-regular text-sm text-[#868686]">

                    <!-- recover -->
                    <button
                      @click.stop="recoverItem('folder', folder)"
                      :disabled="loading"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent
                        text-emerald-600

                        hover:bg-emerald-50
                        hover:border-emerald-400
                        transition-colors duration-300
                        disabled:opacity-40
                      "
                    >
                      <i class="fas fa-rotate-left h-5 w-5 mr-4 text-center" />
                      <span>Recover</span>
                    </button>

                    <!-- delete permanently -->
                    <button
                      @click.stop="confirmDeleteItem('folder', folder.id, folder.name)"
                      :disabled="loading"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent
                        grayscale text-[var(--warning-border)] opacity-50

                        hover:bg-[var(--warning-bg)]
                        hover:text-[var(--warning-border)]
                        hover:border-[var(--warning-border)]
                        hover:grayscale-0 hover:opacity-100
                        transition-colors duration-300
                        disabled:opacity-30
                      "
                    >
                      <i class="fas fa-trash-can h-5 w-5 mr-4 text-center" />
                      <span>Delete permanently</span>
                    </button>

                  </div>
                </template>
              </Dropdown>
            </div>
          </button>
        </div>
      </Transition>
    </div>

    <!-- files section -->
    <div
      v-if="files.length"
      class="w-full py-6 px-2 pt-4 sm:mt-0 sm:py-4 sm:px-14"
    >
      <h3
        class="
          flex items-center
          font-regular text-left text-sm text-[var(--text-terceary)] truncate
          mb-1 gap-2
          sm:text-lg sm:mb-0 sm:font-semibold
        "
      >
        <span>Your Files</span>
        <button
          type="button"
          @click="showFiles = !showFiles"
          class="
            text-xs rounded-xl p-1 border border-transparent mt-0.5
            hover:border-[var(--color-primary)]
            hover:text-[var(--color-primary)]
            transition-all duration-300"
          :class="showFiles ? 'text-[var(--color-primary)]' : 'grayscale'"
        >
          <img :src="showFiles ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'" alt="eye icon" class="h-5" />
        </button>
      </h3>

      <Transition name="slide">
        <div
          v-show="showFiles"
          class="
            grid grid-cols-1 gap-2 mx-0
            text-[var(--text)]
            sm:grid-cols-2 sm:gap-4
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
          "
        >
          <button
            v-for="file in files"
            :key="file.id"
            @click="toggleSelect(file, 'file')"
            class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              cursor-pointer
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
            :class="selectedFiles.some((f: FileI) => f.id === file.id)
              ? 'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]'
              : 'border-[var(--border)]'
            "
          >
            <div class="flex w-full h-auto items-center justify-between relative">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between p-1">
                  <div class="flex items-center space-x-2 min-w-0 w-full overflow-hidden">
                    <!-- checkbox -->
                    <label for="file-{{ file.id }}"></label>
                    <input
                      type="checkbox"
                      :checked="selectedFiles.some((f: FileI) => f.id === file.id)"
                      @click.stop
                      @change="toggleSelect(file, 'file')"
                      class="w-3.5 h-3.5 rounded accent-[var(--color-primary)] flex-shrink-0 ml-1 cursor-pointer"
                    />
                    <!-- file type icon -->
                    <img v-if="file.contentType === 'application/pdf'" src="/icon/icon-pdf.svg" alt="pdf" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" src="/icon/icon-doc.svg" alt="doc" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/vnd.ms-excel' || file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" src="/icon/icon-excel.svg" alt="excel" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/vnd.ms-powerpoint' || file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'" src="/icon/icon-ppt.svg" alt="ppt" class="h-10 w-10" />
                    <img v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)" src="/icon/icon-png.svg" alt="png" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'image/svg+xml'" src="/icon/icon-svg.svg" alt="svg" class="h-10 w-10" />
                    <img v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)" src="/icon/icon-img.svg" alt="img" class="h-10 w-10" />
                    <img v-else-if="/^video\//.test(file.contentType)" src="/icon/icon-video.svg" alt="video" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/zip'" src="/icon/icon-zip.svg" alt="zip" class="h-10 w-10" />
                    <img v-else-if="/^audio\//.test(file.contentType)" src="/icon/icon-audio.svg" alt="audio" class="h-10 w-10" />
                    <img v-else src="/icon/icon-file.svg" alt="file" class="h-10 w-10" />

                    <!-- name & date -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate text-left">
                        {{ file.name }}
                      </h3>
                      <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                        {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} · {{ formatFileSize(file.size) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- actions -->
              <div
                class="
                  flex items-center justify-center
                  border-l border-[var(--border)]
                  w-6 py-1
                  group-hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                <Dropdown
                  :classes="[
                    'bg-[var(--bg-secondary)]',
                    'border border-[var(--border)]',
                    'rounded-2xl',
                    'absolute', '-right-0', 'z-20',
                    dropdownPosition,
                    'w-52',
                    'sm:-right-2'
                  ]"
                >
                  <template #trigger="{ toggle }">
                    <button
                      @click.stop="toggleDropdown(toggle, $event)"
                      class="
                        text-[var(--text-terceary)] w-6 h-10
                        hover:text-[var(--text)]
                        transition-colors duration-300
                      "
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </template>

                  <template #content>
                    <div class="flex flex-col gap-0.5 px-1 py-1 font-regular text-sm text-[#868686]">

                      <!-- recover -->
                      <button
                        @click.stop="recoverItem('file', file.id)"
                        :disabled="loading"
                        class="
                          flex items-center justify-start
                          rounded-xl px-2 py-1 border border-transparent
                          text-emerald-600

                          hover:bg-emerald-50
                          hover:border-emerald-400
                          transition-colors duration-300
                          disabled:opacity-40
                        "
                      >
                        <i class="fas fa-rotate-left h-5 w-5 mr-4 text-center" />
                        <span>Recover</span>
                      </button>

                      <!-- delete permanently -->
                      <button
                        @click.stop="confirmDeleteItem('file', file.id, file.name)"
                        :disabled="loading"
                        class="
                          flex items-center justify-start
                          rounded-xl px-2 py-1 border border-transparent
                          grayscale text-[var(--warning-border)] opacity-50

                          hover:bg-[var(--warning-bg)]
                          hover:text-[var(--warning-border)]
                          hover:border-[var(--warning-border)]
                          hover:grayscale-0 hover:opacity-100
                          transition-colors duration-300
                          disabled:opacity-30
                        "
                      >
                        <i class="fas fa-trash-can h-5 w-5 mr-4 text-center" />
                        <span>Delete permanently</span>
                      </button>

                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </button>
        </div>
      </Transition>
    </div>

    </div>
  </template>

  <!-- confirm delete modal -->
  <Modal v-model="confirmDialog.visible" size="sm">
    <template #header>
      <h3 class="text-lg font-light text-[var(--text)] flex items-center gap-2">
        <i class="fas fa-triangle-exclamation text-[var(--warning-border)]" />
        Delete permanently
      </h3>
    </template>

    <template #content>
      <p class="text-sm text-[var(--text-terceary)] my-2">
        <template v-if="confirmDialog.isBulk">
          Are you sure you want to permanently delete
          <span class="font-semibold text-[var(--text)]">{{ selectedFiles.length + selectedFolders.length }} items</span>?
        </template>
        <template v-else>
          Are you sure you want to permanently delete
          <span class="font-semibold text-[var(--text)]">"{{ confirmDialog.name }}"</span>?
        </template>
      </p>
      <p class="text-xs text-[var(--warning-border)] font-medium flex items-center gap-1">
        <i class="fas fa-circle-exclamation" />
        This action cannot be undone.
      </p>
    </template>

    <template #footer>
      <button
        type="button"
        @click="confirmDialog.visible = false"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full px-3
        "
      >
        Cancel
      </button>
      <button
        @click="executeDelete"
        :disabled="loading"
        class="
          flex items-center gap-2
          text-sm border rounded-full px-3
          text-white bg-red-500 border-red-500
          hover:bg-red-600
          hover:shadow-[0_0_3px_3px_rgba(239,68,68,0.4)]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <i class="fas fa-trash-can text-xs" />
        {{ loading ? 'Deleting...' : 'Delete permanently' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FileI, FilesResultI } from '@/store/files/state';

const store = useStore();

const loading = ref(false);
const showFolders = ref(true);
const showFiles = ref(true);
const selectedFiles = ref<FileI[]>([]);
const selectedFolders = ref<FolderI[]>([]);
const dropdownPosition = ref('top-8');

const confirmDialog = reactive({
  visible: false,
  isBulk: false,
  type: '' as 'folder' | 'file' | '',
  id: null as number | null,
  name: '',
});

const trashFolder = computed<FolderI>(() => store.state.folders.trashFolder);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const fileResults = computed<FilesResultI>(() => store.state.files.result);

const folders = computed<FolderI[]>(() => folderResults.value?.data ?? []);
const files = computed(() => fileResults.value?.data ?? []);

function toggleSelect(item: FileI | FolderI, type: 'file' | 'folder') {
  if (type === 'file') {
    selectedFiles.value.push(item as FileI);
  } else if (type === 'folder') {
    selectedFolders.value.push(item as FolderI);
  }
}

function clearSelection() {
  selectedFiles.value = [];
  selectedFolders.value = [];
}

function formatDate(date: number) {
  return moment(date * 1000).fromNow();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function toggleDropdown(toggle: () => void, event: Event) {
  event.stopPropagation();
  toggle();
}

function notify(type: 'success' | 'error', message: string) {
  store.commit('notifications/addNotification', { type, message });
}

async function getTrashFolder() {
  loading.value = true;
  try {
    await store.dispatch('folders/getTrashFolder');
  } catch {
    notify('error', 'Error getting the trash folder');
  } finally {
    loading.value = false;
  }
}

async function getFolders() {
  loading.value = true;
  try {
    await store.dispatch('folders/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error getting folders');
  } finally {
    loading.value = false;
  }
}

async function getFiles() {
  loading.value = true;
  try {
    await store.dispatch('files/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error getting files');
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await getFolders();
  await getFiles();
}

async function recoverItem(type: 'folder' | 'file', item: FileI | FolderI) {
  loading.value = true;
  try {
    if (type === 'folder') {
      await store.dispatch('folders/restoreFolders', [item as FolderI]);
    } else if (type === 'file') {
      await store.dispatch('files/restoreFiles', [item as FileI]);
    }
    notify('success', 'Item recovered successfully');
    await refresh();
  } catch {
    notify('error', 'Error recovering item');
  } finally {
    loading.value = false;
  }
}

async function recoverSelected() {
  loading.value = true;
  try {
    if (selectedFiles.value.length) {
      await store.dispatch('files/restoreFiles', selectedFiles.value);
    }

    if (selectedFolders.value.length) {
      await store.dispatch('folders/restoreFolders', selectedFolders.value);
    }

    notify('success', 'Items recovered successfully');
    clearSelection();
    await refresh();
  } catch {
    notify('error', 'Error recovering items');
  } finally {
    loading.value = false;
  }
}

function confirmDeleteItem(type: 'folder' | 'file', id: string | number, name: string) {
  Object.assign(
    confirmDialog,
    {
      isBulk: false,
      type,
      id,
      name,
      visible: true,
    },
  );
}

function confirmDeleteSelected() {
  Object.assign(confirmDialog, { isBulk: true, visible: true });
}

async function executeDelete() {
  loading.value = true;
  try {
    if (confirmDialog.isBulk) {
      if (selectedFolders.value.length) {
        await store.dispatch('folders/removeFoldersFromTrash', selectedFolders.value);
      }
      if (selectedFiles.value.length) {
        await store.dispatch('files/removeFilesFromTrash', selectedFiles.value);
      }

      notify('success', 'Items permanently deleted');
      clearSelection();
    } else {
      await store.dispatch(`${confirmDialog.type}s/deletePermanently`, { id: confirmDialog.id });
      notify('success', 'Item permanently deleted');
    }
    confirmDialog.visible = false;
    await refresh();
  } catch {
    notify('error', 'Error deleting items');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getTrashFolder();
  await getFolders();
  await getFiles();
});
</script>
