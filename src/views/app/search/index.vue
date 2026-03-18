<template>
  <div class="mt-10 pt-10 mx-2 sm:mx-14">
    <h1 class="text-xl mt-8 sm:mt-0 font-semibold font-alexandria mb-4 text-[var(--text)] hidden sm:block">
      Search Results for:
      <span v-if="searchQuery" class="text-xl font-light ml-1 text-[var(--text-terceary)]">
        "{{ searchQuery }}"
      </span>
    </h1>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-[var(--color-primary)]"></i>
    </div>

    <!-- if no results -->
    <div v-else-if="!folders.length && !files.length" class="flex flex-col justify-center items-center py-20">
      <i class="fas fa-search text-4xl text-[var(--text-terceary)] mb-4"></i>
      <p class="text-[var(--text-terceary)] text-lg">No results found</p>
      <p class="text-[var(--text-terceary)] text-sm mt-2" v-if="searchQuery">
        Try searching with different keywords
      </p>
    </div>

    <!-- folders -->
    <div v-if="folders.length" class="w-full my-4 px-2">
      <h3
        class="
          flex items-center
          font-regular text-left text-sm text-[var(--text-terceary)] truncate
          mb-1 gap-2

          sm:text-lg sm:mb-0 sm:font-semibold
        "
      >
        Folders ({{ folders.length }})
      </h3>
      <div
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
        <div
          v-for="folder in folders"
          :key="folder.id"
          @dragover.prevent
          @dragenter="onDragEnter(folder.id)"
          @dragleave="onDragLeave"
          @drop="onDrop(folder)"
          data-selectable

          :draggable="true"
          @dragstart="onDragStart('folder', folder)"
          @click="selectItem($event, 'folder', folder, index)"
          @keydown.enter="selectItem($event, 'folder', folder, index)"
          @dblclick="router.push(`/app/folders/${folder.id}`);"
          class="
            group
            flex items-center justify-between
            w-full
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            rounded-2xl min-w-0
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            transition-all duration-300
          "
          :class="[
            'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
            isSelectedFolder(folder) ?
              'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]' :
              'border-[var(--border)]'
          ]"
        >
        <div class="flex items center justify-between p-1">
              <div
                  class="
                    flex items-center
                    space-x-2
                    min-w-0 w-full overflow-hidden
                  "
                >
                <img src="/icon/icon-folder.svg" alt="folder" class="h-8"/>

                <!-- title and date -->
                <div class="flex-1 min-w-0">
                  <div>
                    <input
                      v-if="editingFolderId === folder.id"
                      v-model="editedFolderName"
                      @keyup.enter="saveFolderName(folder)"
                      :data-folder-id="folder.id"
                      @blur="editingFolderId = null"
                      class="
                        bg-transparent
                        border-b border-[var(--color-primary)]
                        outline-none text-xs sm:text-sm w-full"
                    />

                    <h3
                      v-else
                      class="font-semibold text-xs sm:text-sm truncate text-left"
                    >
                      {{ folder.name }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <!-- options -->
            <div
              class="
                flex items-center justify-center
                border-l border-[var(--border)]
                w-6 h-full py-2

                group-hover:border-[var(--color-primary)]
                transition-colors duration-300
              "
            >
              <Dropdown
                :classes="[
                  'bg-[var(--bg-secondary)]',
                  'border border-[var(--border)]',
                  'rounded-2xl',
                  'absolute','-right-0', 'z-20',
                  dropdownPosition,
                  'w-48',
                  'sm:-right-2'
                ]"
              >
                <template #trigger="{ toggle }">
                  <button
                    @click="toggleDropdown(toggle, $event)"
                    class="
                      text-[var(--text-terceary)]
                      w-6 h-auto

                      hover:text-[var(--text)]
                      transition-colors duration-300
                    "
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </template>

                <template #content="{ }">
                  <div class="flex flex-col gap-0.5 px-1 py-1 font-regular text-sm text-[#868686]">

                    <!--rename folder-->
                    <button
                      type="button"
                      @click="() => { startEditingFolder(folder); closeDropdown(); }"
                      class="flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300"
                    >
                      <img src="/icon/icon-edit.svg" alt="edit" class="h-5 mr-4 grayscale"/>
                      <span>Rename</span>
                    </button>

                    <!--move to folder-->
                    <button
                      type="button"
                      @click="selectItem($event, 'folder', folder, index); moveToFolderModal = true;"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon_move.svg" alt="move" class="h-5 mr-4 grayscale"/>
                      <span>Move to folder</span>
                    </button>

                    <!-- move to trash -->
                    <button
                      @click="selectItem($event, 'folder', folder, index); moveToTrash();"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent
                        grayscale text-[var(--warning-border)] opacity-50

                        hover:bg-[var(--warning-bg)]
                        hover:text-[var(--warning-border)]
                        hover:border-[var(--warning-border)]
                        hover:grayscale-0 hover:opacity-100
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon-delate.svg" alt="delate" class="h-5 mr-4"/>
                      <span>Send to the Void</span>
                    </button>
                  </div>
                </template>
              </Dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- files -->
    <div v-if="files.length" class="w-full my-4 mx-2">
      <h3
        class="
          flex items-center
          font-regular text-left text-md text-[var(--text-terceary)] truncate
          gap-2

          sm:mb-2 sm:font-semibold
        "
      >
        Files ({{ files.length }})
      </h3>
      <div
        class="
          grid grid-cols-1 gap-2 mx-0
          text-[var(--text)]

          sm:grid-cols-2 sm:gap-4 sm:mx-0
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
      >
        <div
          v-for="file, index in fileResults.data"
          :key="file.id"
          data-selectable

          :draggable="true"
          @dragstart="onDragStart('file', file)"
          @click="selectItem($event, 'file', file, index)"
          @keydown.enter="selectItem($event, 'file', file, index)"
          @dblclick="router.push(`/app/files/details/${file.id}`);"

          class="
            group
            flex items-center justify-between
            w-full
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            rounded-2xl min-w-0
            cursor-move
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            transition-colors duration-300
          "
          :class="[
            'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
            isSelectedFile(file) ?
              'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]' :
              'border-[var(--border)]'
          ]"
      >
        <div class="flex w-full h-auto items-center justify-between relative">
          <div class="flex-1 min-w-0">
            <div class="flex items center justify-between p-1">
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
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/msword' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  "
                  src="/icon/icon-doc.svg"
                  alt="Word file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-excel' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  "
                  src="/icon/icon-excel.svg"
                  alt="Word file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="
                    file.contentType === 'application/vnd.ms-powerpoint' ||
                    file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  "
                  src="/icon/icon-ppt.svg"
                  alt="PowerPoint file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
                  src="/icon/icon-png.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="file.contentType === 'image/svg+xml'"
                  src="/icon/icon-svg.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
                  src="/icon/icon-img.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="/^video\//.test(file.contentType)"
                  src="/icon/icon-video.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="file.contentType === 'application/zip'"
                  src="/icon/icon-zip.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else-if="/^audio\//.test(file.contentType)"
                  src="/icon/icon-audio.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <img
                  v-else
                  src="/icon/icon-file.svg"
                  alt="image file icon"
                  class="h-10 w-10"
                />
                <!-- title and date -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate text-left">
                    {{ file.name }}
                  </h3>
                  <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                    {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} - {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- options -->
          <div
            class="
              flex items-center justify-center
              border-l border-[var(--border)]
              w-6 py-1 h-full

              group-hover:border-[var(--color-primary)]
              transition-colors duration-300
            "
          >
            <Dropdown
              :classes="[
                'bg-[var(--bg-secondary)]',
                'border border-[var(--border)]',
                'rounded-2xl',
                'absolute','-right-0', 'z-20',
                dropdownPosition,
                'w-48',
                'sm:-right-2'
              ]"
            >
              <template #trigger="{ toggle }">
                <button
                  @click="toggleDropdown(toggle, $event)"
                  class="
                    text-[var(--text-terceary)]
                    w-6 h-10

                    hover:text-[var(--text)]
                    transition-colors duration-300
                  "
                >
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </template>

              <template #content="{ }">
                <div class="flex flex-col gap-0.5 px-1 py-1 font-regular text-sm text-[#868686]">

                  <!-- info file -->
                  <router-link
                    :to="`/app/files/details/${file.id}`"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon_details.svg" alt="download" class="h-5 mr-4"
                    />
                    <span>info</span>
                  </router-link>

                  <!-- preview file -->
                  <router-link
                    :to="`/app/files/details/${file.id}`"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon-preview.svg" alt="preview" class="h-5 mr-4"/>
                    <span>Preview</span>
                  </router-link>

                  <!--move to folder-->
                  <button
                    v-if="selectedFiles.length > 0"
                    type="button"
                    @click="moveToFolderModal = true"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon_move.svg" alt="move" class="h-5 mr-4"/>
                    <span>Move to folder</span>
                  </button>

                  <Modal v-model="moveToFolderModal" size="xl">
                    <template #header>
                      <!-- <div class="border-b border-[var(--border)] w-full px-6 pb-4"> -->
                      <h3 class="text-lg font-light">Move:
                      <span class="text-lg font-light">"{{ file.name }}"</span>
                      </h3>
                      <!-- </div> -->
                    </template>

                    <template #content>
                      <form @submit.prevent="moveToFolder" id="move-to-folder-form" class="my-2">
                        <div
                          class="
                            grid grid-cols-2 md:grid-cols-3 gap-2
                            ">

                        <button
                          v-for="folder in folderResults.data"
                          :key="folder.id"
                          type="button"
                          @click="selectedFolder = folder.id"
                          class="
                            flex items-center justify-start
                            px-2 py-0.5 gap-1.5
                            rounded-xl
                            border border-transparent
                            text-[var(--text-terceary)]
                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.3)]
                            hover:text-[var(--text)]
                            transition
                          "
                          :class="selectedFolder === folder.id ? 'bg-[var(--hover-bg)] border-[var(--color-primary)]' : ''"
                        >
                          <img src="/icon/icon-folder.svg" alt="folder" class="h-4.5"/>
                          <span class="text-sm text-left truncate w-full">
                            {{ folder.name }}
                          </span>
                        </button>

                        </div>
                      </form>
                    </template>

                    <template #footer>
                      <button
                        type="button"
                        @click="moveToFolderModal = false; selectedFolder = null;"
                        class="
                          text-[var(--text-secondary)] text-sm
                          border border-[var(--border)] bg-[var(--bg)]
                          rounded-full
                          px-3
                        ">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="move-to-folder-form"
                        class="
                          text-[var(--text)] text-sm
                          border
                          rounded-full
                          px-3
                          transition
                        "
                        :class="!selectedFolder
                          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
                          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
                      >
                        Move
                      </button>
                    </template>
                  </Modal>

                  <!--share link-->
                  <button
                    @click="copyLink(file)"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      transition-all duration-300
                    "
                  >
                    <img src="/icon/icon-link.svg" alt="link" class="h-5 mr-4"
                    />
                    {{ copied ? 'Copied!' : 'Copy link' }}
                  </button>

                  <!-- download -->
                  <button
                    @click="downloadFile(file)"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent
                      grayscale

                      hover:bg-[var(--hover-bg)]
                      hover:text-[var(--color-primary)]
                      hover:border-[var(--color-primary)]
                      hover:grayscale-0
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon_download_2.svg" alt="download" class="h-5 mr-4"
                    />
                    <span>Download</span>
                  </button>
                </div>
              </template>
            </Dropdown>
          </div>
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
  nextTick,
  watch,
  defineAsyncComponent,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';

import { SearchResultI, FileI, FilesResultI } from '@/store/files/state';
import { FolderI, FoldersResultI } from '@/store/folders/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const dropdownPosition = ref('top-8');
const activeDropdownToggle = ref<(() => void) | null>(null);
const moveToFolderModal = ref(false);
const editingFileId = ref<number | string | null>(null);
const editedFileName = ref('');
const editingFolderId = ref<number | null>(null);
const editedFolderName = ref('');
const selectedFolder = ref<number | string | null>(null);
const draggedItem = ref<FileI | FolderI | null>(null);
const draggedFolder = ref<number | string | null>(null);
const lastSelectedIndex = ref<number | null>(null);

const searchResult = computed<SearchResultI>(() => store.state.files.searchResult);
const fileResults = computed<FilesResultI>(() => store.state.files.result);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolders = computed<FolderI[]>(() => store.state.folders.selectedFolders);

const isSelectedFile = (item: FileI) => selectedFiles.value.some((f: FileI) => f.id === item.id);
const isSelectedFolder = (item: FolderI) => selectedFolders.value.some((f: FolderI) => f.id === item.id);

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

function selectItem(event: KeyboardEvent, type: 'file' | 'folder', item: FileI | FolderI, index: number) {
  if (event.ctrlKey) {
    if (type === 'file') {
      const exists = selectedFiles.value.find((f: FileI) => f.id === item.id);
      if (exists) {
        store.commit('files/setSelectedFiles', selectedFiles.value.filter((f: FileI) => f.id !== item.id));
      } else {
        selectedFiles.value.push(item as FileI);
      }
    } else if (type === 'folder') {
      const exists = selectedFolders.value.find((f: FolderI) => f.id === item.id);
      if (exists) {
        store.commit('folders/setSelectedFolders', selectedFolders.value.filter((f: FolderI) => f.id !== item.id));
      } else {
        selectedFolders.value.push(item as FolderI);
      }
    }
    lastSelectedIndex.value = index;
    return;
  }

  console.log('item', item);
  console.log('type', type);
  console.log('index', index);

  if (type === 'file') {
    store.commit('files/setSelectedFiles', [item as FileI]);
    console.log('selectedFiles', selectedFiles.value);
  } else if (type === 'folder') {
    store.commit('folders/setSelectedFolders', [item as FolderI]);
    console.log('selectedFolders', selectedFolders.value);
  }
  lastSelectedIndex.value = index;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

function onDragStart(type: string, item: FileI | FolderI) {
  if (type === 'file') {
    if (!isSelectedFile(item as FileI)) {
      store.commit('files/setSelectedFiles', [item]);
    }
  } else if (type === 'folder') {
    if (!isSelectedFolder(item as FolderI)) {
      store.commit('folders/setSelectedFolders', [item]);
    }
  }

  draggedItem.value = item;
}

function onDragEnter(fId: number | string | null) {
  draggedFolder.value = fId;
}

function onDragLeave() {
  draggedFolder.value = null;
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

async function onDrop(folder: FolderI) {
  if (selectedFiles.value.length === 0 && selectedFolders.value.length === 0) return;

  if (!draggedItem.value) return;

  const fId = folder.id as number;

  const filesPayload: FileI[] = selectedFiles.value.map((file: FileI) => ({
    ...file,
    folderId: fId,
  }));

  await store.dispatch('files/moveFilesToFolder', filesPayload);

  store.commit('files/setSelectedFiles', []);

  const foldersPayload: FolderI[] = selectedFolders.value
    .filter((f: FolderI) => f.id !== fId)
    .map((f: FolderI) => ({
      ...f,
      folderId: fId,
    }));

  console.log('foldersPayload', foldersPayload);

  await store.dispatch('folders/moveFoldersToFolder', foldersPayload);

  draggedItem.value = null;
  draggedFolder.value = null;

  getSearchResult();
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

// toggle dropdown position based on click position
const toggleDropdown = async (toggle: () => void, event?: MouseEvent) => {
  if (event) event.stopPropagation();

  activeDropdownToggle.value = toggle;

  toggle();

  await nextTick();

  const middle = window.innerHeight / 2;
  const y = event?.clientY || 0;

  dropdownPosition.value = y > middle ? 'bottom-8' : 'top-8';
};

function closeDropdown() {
  activeDropdownToggle.value?.();
}

// rename folder
async function startEditingFolder(folder: FolderI) {
  editingFolderId.value = folder.id;
  editedFolderName.value = folder.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-folder-id="${folder.id}"]`,
  ) as HTMLInputElement | null;

  input?.focus();
  input?.select();
}

async function saveFolderName(folder: FolderI) {
  const finalName = editedFolderName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('folders/changeFolderName', {
      id: folder.id,
      name: finalName,
    });

    await store.dispatch('folders/filter', {
      query: '',
      page: 1,
      folderId: '',
    });

    await nextTick();

    const updatedFolder = folderResults.value.data.find(
      (f: FolderI) => f.id === folder.id,
    );

    if (updatedFolder) {
      store.commit('folders/setSelectedFolders', [updatedFolder]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    editingFolderId.value = null;
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
