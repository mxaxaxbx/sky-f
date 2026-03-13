<template>
  <!-- loading -->
  <div v-if="loading" class="flex justify-center items-center py-20 text-[var(--color-primary)]">
    <i class="fas fa-spinner fa-spin text-2xl text-[var(--text)]"></i>
  </div>

  <!-- if not results -->
  <div v-if="!fileResults.data.length && !folderResults.data.length" class=" flex justify-center items-center py-20 w-full">
    <p class="text-[var(--text-terceary)]">This folder is waiting for something awesome.</p>
  </div>

  <!-- folders -->
  <div class="w-full border-b border-[var(--border)] py-0 px-2 pt-4 sm:py-4 sm:px-14">
    <h3
      class="
        flex items-center
        font-regular text-left text-sm text-[var(--text-terceary)] truncate
        mb-1 px-3 gap-2

        sm:text-lg sm:mb-0 sm:font-semibold
      "
    >
      <span>Folders</span>
      <button
        type="button"
        @click="showFolders = !showFolders"
        class="text-xs rounded-full mt-0.5
          hover:text-[var(--color-primary)]
          transition-all duration-300"
        :class="showFolders ? '-rotate-90 text-[var(--color-primary)]' : 'rotate-0'"
      >
        <i class="fa-solid fa-chevron-down"></i>
      </button>
    </h3>
    <Transition name="slide">
      <div
        v-show="showFolders"
        class="
          grid grid-cols-2 gap-2 mx-0
          text-[var(--text)] my-4

          sm:grid-cols-2 sm:gap-4 sm:mx-4 sm:my-4
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          transition-all duration-300
        "
      >
        <div
          v-for="folder, index in folderResults.data"
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
          <div
            :to="`/app/folders/${folder.id}`"
            class="flex-1 min-w-0"
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
          </div>
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
    </Transition>
  </div>

  <!-- files -->
  <div class="w-full py-6 px-2 pt-4 sm:mt-0 sm:py-4 sm:px-14">
    <div class="flex items-center justify-between px-3 mb-4 sm:mb-4">
      <h3
        class="
          flex items-center
          font-regular text-left text-sm text-[var(--text-terceary)] truncate
          gap-2

          sm:text-lg sm:mb-0 sm:font-semibold
        "
      >
        <span>Your Files</span>
        <button
          type="button"
          @click="showFiles = !showFiles"
          class="text-xs rounded-full mt-0.5
            hover:text-[var(--color-primary)]
            transition-all duration-300"
          :class="showFiles ? '-rotate-90 text-[var(--color-primary)]' : 'rotate-0'"
        >
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </h3>
      <!-- order by -->
      <button
        v-show="showFiles"
        @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'; getFiles()"
        class="
          flex items-center justify-center
          px-2 py-0.5
          text-xs text-[var(--text-terceary)]
          rounded-full border border-[var(--border)]
          hover:bg-[var(--hover-bg)]
          hover:border-[var(--color-primary)]
          transition-all duration-300
        "
      >Order:
        {{ sortOrder === 'desc' ? 'Newest' : 'Oldest' }}
      </button>
    </div>
    <Transition name="slide">
      <div
        v-show="showFiles"
        class="
          grid grid-cols-1 gap-2 mx-0
          text-[var(--text)]
          sm:grid-cols-2 sm:gap-4 sm:mx-4
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
                    <div>
                      <input
                        v-if="editingFileId === file.id"
                        v-model="editedFileName"
                        :data-file-id="file.id"
                        @keyup.enter="saveFileName(file)"
                        @blur="editingFileId = null"
                        class="
                          bg-transparent
                          border-b border-[var(--color-primary)]
                          outline-none text-xs sm:text-sm w-full"
                      />

                      <h3
                        v-else
                        class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate text-left"
                      >
                        {{ file.name }}
                      </h3>
                    </div>
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
                      <img src="/icon/icon_details.svg" alt="download" class="h-5 mr-4 grayscale"
                      />
                      <span>info</span>
                    </router-link>

                    <!-- preview file -->
                    <button
                      @click="store.dispatch('files/previewFile', file)"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon-preview.svg" alt="preview" class="h-5 mr-4 grayscale"/>
                      <span>Preview</span>
                    </button>

                    <!-- rename -->
                    <button
                      type="button"
                      @click="() => { startEditingFile(file); closeDropdown(); }"
                      class="
                        flex items-center justify-start
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
                      @click="selectItem($event, 'file', file, index); moveToFolderModal = true;"
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
                      <img src="/icon/icon-link.svg" alt="link" class="h-5 mr-4 grayscale"/>
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

                    <!-- move to trash -->
                    <button
                      @click="selectItem($event, 'file', file, index); moveToTrash();"
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
    </Transition>
  </div>

  <Modal v-model="moveToFolderModal" size="xl">
    <template #header>
      <h3 class="text-lg font-light">Move:
        <p v-for="file in selectedFiles" :key="file.id">
          "{{ file.name }}"
        </p>
      </h3>
    </template>

    <template #content>
      <form @submit.prevent="moveToFolder" id="move-to-folder-form" class="my-2">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            type="button"
            @click="selectedFolder = 0"
            class="
              flex items-center justify-start
              px-2 py-0.5 gap-1.5
              rounded-xl
              border border-transparent
              text-[var(--text-terceary)]
            "
            :class="selectedFolder === 0 ? 'bg-[var(--bg)] border-[var(--color-primary)]' : ''"
          >
            <img src="/icon/icon-folder.svg" alt="folder" class="h-4.5"/>
            <span class="text-sm text-left truncate w-full">
              Root
            </span>
          </button>
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
            :class="selectedFolder === folder.id ? 'bg-[var(--bg)] border-[var(--color-primary)]' : ''"
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
      <!-- cancel button -->
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

      <!-- move button -->
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
        :class="selectedFolder === null
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'
        "
      >
        Move
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI, FilesResultI } from '@/store/files/state';
import { FolderI, FoldersResultI } from '@/store/folders/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const copied = ref(false);
const dropdownPosition = ref('top-8');
const showFolders = ref(true);
const showFiles = ref(true);
const draggedItem = ref<FileI | FolderI | null>(null);
const draggedFolder = ref<number | string | null>(null);
const lastSelectedIndex = ref<number | null>(null);
const moveToFolderModal = ref(false);
const activeDropdownToggle = ref<(() => void) | null>(null);
const editingFileId = ref<number | string | null>(null);
const editedFileName = ref('');
const editingFolderId = ref<number | string | null>(null);
const editedFolderName = ref('');
const selectedFolder = ref<number | string | null>(null);

const fileResults = computed<FilesResultI>(() => store.state.files.result);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const folderId = computed<number>(() => Number(route.params.id as string));
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolders = computed<FolderI[]>(() => store.state.folders.selectedFolders);

const isSelectedFile = (item: FileI) => selectedFiles.value.some((f: FileI) => f.id === item.id);
const isSelectedFolder = (item: FolderI) => selectedFolders.value.some((f: FolderI) => f.id === item.id);

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
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

// Select item with ctrl key
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

// rename file
async function startEditingFile(currentFile: FileI) {
  // eslint-disable-next-line no-param-reassign
  editingFileId.value = currentFile.id;

  // Mostrar nombre completo (incluye extensión)
  editedFileName.value = currentFile.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-file-id="${currentFile.id}"]`,
  ) as HTMLInputElement | null;

  if (!input) return;

  input.focus();

  const lastDotIndex = currentFile.name.lastIndexOf('.');

  if (lastDotIndex > 0) {
    // Selecciona solo el nombre, deja visible la extensión
    input.setSelectionRange(0, lastDotIndex);
  } else {
    input.select();
  }
}

async function saveFileName(currentFile: FileI) {
  const finalName = editedFileName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('files/changeFileName', {
      id: currentFile.id,
      name: finalName,
    });

    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      orderBy: 'created',
      order: 'desc',
      folderId: folderId.value,
    });

    const updatedFile = fileResults.value.data.find(
      (f: FileI) => f.id === currentFile.id,
    );

    if (updatedFile) {
      store.commit('files/setSelectedFiles', [updatedFile]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    editingFileId.value = null;
  }
}

// move to folder
async function moveToFolder() {
  if (selectedFolder.value === null) {
    return;
  }

  if (selectedFolder.value === 0) {
    selectedFolder.value = null;
  }

  try {
    loading.value = true;
    console.log('selectedFiles', selectedFiles.value);
    if (selectedFiles.value.length > 0) {
      const payload: FileI[] = selectedFiles.value.map((file: FileI) => ({
        ...file,
        folderId: selectedFolder.value,
      }));
      console.log('payloadFiles', payload);

      if (payload.length > 0) {
        await store.dispatch('files/moveFilesToFolder', payload);
      }

      await store.dispatch('files/filter', {
        query: '',
        page: 1,
        orderBy: 'created',
        order: 'desc',
        folderId: folderId.value,
      });
    }

    console.log('selectedFolders', selectedFolders.value);
    if (selectedFolders.value.length > 0) {
      const payload: FolderI[] = selectedFolders.value.map((folder: FolderI) => ({
        ...folder,
        folderId: selectedFolder.value,
      }));
      console.log('payloadFolders', payload);

      if (payload.length > 0) {
        await store.dispatch('folders/moveFoldersToFolder', payload);
      }

      await store.dispatch('folders/filter', {
        query: '',
        page: 1,
        folderId: folderId.value,
      });
    }

    moveToFolderModal.value = false;
    selectedFolder.value = null;
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

// copy link to clipboard
const copyLink = async (file: FileI) => {
  const url = await store.dispatch('files/getDownloadUrl', file);
  await navigator.clipboard.writeText(url);

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

async function downloadFile(file: FileI) {
  await store.dispatch('files/downloadFile', file);
}

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

async function getFolders() {
  loading.value = true;
  try {
    // Load all folders - filtering by folderId is done client-side
    await store.dispatch('folders/filter', {
      query: '',
      page: 1,
      folderId: folderId.value,
    });
  } catch (error) {
    console.error('Error loading folders:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener las carpetas',
    });
  } finally {
    loading.value = false;
  }
}

async function getFiles() {
  loading.value = true;
  try {
    // Load all files - filtering by folderId is done client-side
    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      folderId: folderId.value,
    });
  } catch (error) {
    console.error('Error loading files:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los archivos',
    });
  } finally {
    loading.value = false;
  }
}

async function saveFolderName(folder: FolderI) {
  const finalName = editedFolderName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('folders/changeFolderName', {
      id: folder.id,
      name: finalName,
    });

    await getFiles();
    await getFolders();

    await nextTick();

    const updatedFolder = folderResults.value.data.find(
      (f: FolderI) => f.id === folder.id,
    );

    if (updatedFolder) {
      store.commit('folders/setSelectedFolders', [updatedFolder]);
    }
  } catch (error) {
    console.error(error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al cambiar el nombre de la carpeta',
    });
  } finally {
    editingFolderId.value = null;
  }
}

async function moveToTrash() {
  if (selectedFiles.value.length > 0) {
    await store.dispatch('folders/moveFilesToTrash', selectedFiles.value);
  }
  if (selectedFolders.value.length > 0) {
    await store.dispatch('folders/moveFoldersToTrash', selectedFolders.value);
  }

  getFiles();
  getFolders();
}

// Watch for route changes
watch(() => route.params.id, () => {
  getFolders();
  getFiles();
}, { immediate: true });

onMounted(() => {
  getFolders();
  getFiles();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px; /* ajusta según tu contenido */
  opacity: 1;
  transform: translateY(0);
}
</style>
