<template>
  <h1
    class="
      text-xl text-[var(--text)] font-semibold
      mx-2 my-2 px-12 font-alexandria

      sm:mt-6
      hidden sm:block
    "
  >
    Could Drive
  </h1>

  <!-- loading -->
  <div v-if="loading" class="flex justify-center items-center">
    <i class="fas fa-spinner fa-spin text-2xl"></i>
  </div>

  <!-- if not results -->
  <div
    v-else-if="!fileResults.data.length && !folderResults.data.length"
    class="flex justify-center items-center mx-auto">
    <p class="text-[var(--text-terceary)] font-regular text-lg">Looks like this space is clear</p>
  </div>

  <!-- folders -->
  <div class="w-full border-b border-[var(--border)] mt-20 py-0 px-2 pt-4 sm:mt-0 sm:py-4 sm:px-14">
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
          v-for="folder in folderResults.data"
          :key="folder.id"
          @dragover.prevent
          @dragenter="onDragEnter(folder.id)"
          @dragleave="onDragLeave"
          @drop="onDrop(folder)"
          class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
              transition-all duration-300
            "
          >
          <router-link
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
                  <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
                    {{ folder.name }}
                  </h3>
                </div>
              </div>
            </div>
          </router-link>
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
                    <!-- <router-link
                      :to="`/app/folders/details/${folder.id}`"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon_details.svg" alt="download" class="h-5 mr-3" />
                      <span>info</span>
                    </router-link> -->

                    <!-- rename-folders -->
                    <router-link
                      :to="``"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon-edit.svg" alt="edit" class="h-5 mr-4"/>
                      <span>Rename</span>
                    </router-link>
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
          :draggable="true"
          @dragstart="onDragStart(file)"
          @click="selectFile($event, file, index)"
          @keydown.enter="selectFile($event, file, index)"
          @keydown.space.prevent="selectFile($event, file, index)"
          @dblclick="router.push(`/app/files/details/${file.id}`);"
          @longpress="selectFile($event, file, index)"
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
            hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
            transition-colors duration-300
          "
          :class="[
            'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
            isSelected(file) ?
              'border-[var(--color-primary)] bg-[var(--hover-bg)]' :
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

                    <!-- rename -->
                    <router-link
                      :to="``"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon-edit.svg" alt="edit" class="h-5 mr-4"/>
                      <span>Rename</span>
                    </router-link>

                    <!--move to folder-->
                    <button
                      type="button"
                      @click="selectFile($event, file, index); moveToFolderModal = true;"
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
    </Transition>
  </div>

  <Modal v-model="moveToFolderModal" size="xl">
    <template #header>
      <!-- <div class="border-b border-[var(--border)] w-full px-6 pb-4"> -->
      <h3 class="text-lg font-light">Move:
      <!-- <span class="text-lg font-light">"{{ file.name }}"</span> -->
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
        :class="!selectedFolder
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
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
  onUnmounted,
  nextTick,
  defineAsyncComponent,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';

import { FileI, FilesResultI } from '@/store/files/state';
import { FolderI, FoldersResultI } from '@/store/folders/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const store = useStore();
const router = useRouter();

const sortOrder = ref<'desc' | 'asc'>('desc');
const loading = ref(false);
const copied = ref(false);
const dropdownPosition = ref('top-8');
const showFolders = ref(true);
const showFiles = ref(true);
const draggedFile = ref<FileI | null>(null);
const draggedFolder = ref<number | string | null>(null);
const lastSelectedIndex = ref<number | null>(null);
const moveToFolderModal = ref(false);

const fileResults = computed<FilesResultI>(() => store.state.files.result);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolder = ref<number | string | null>(null);
const isSelected = (file: FileI) => selectedFiles.value.some((f: FileI) => f.id === file.id);

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
    const payload: FileI[] = selectedFiles.value.map((file: FileI) => ({
      ...file,
      folderId: selectedFolder.value,
    }));

    await store.dispatch('files/moveFilesToFolder', payload);
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

// toggle dropdown position based on click position
const toggleDropdown = async (toggle: () => void) => {
  toggle();

  await nextTick();

  const middle = window.innerHeight / 2;
  const y = window.event?.clientY || 0;

  if (y > middle) {
    dropdownPosition.value = 'bottom-8';
  } else {
    dropdownPosition.value = 'top-8';
  }
};

// copy link to clipboard
const copyLink = async (file: FileI) => {
  const url = await store.dispatch('files/getDownloadUrl', file);
  await navigator.clipboard.writeText(url);

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

function selectFile(event: KeyboardEvent, file: FileI, index: number) {
  // CTRL selection
  if (event.ctrlKey) {
    const exists = selectedFiles.value.find((f: FileI) => f.id === file.id);

    if (exists) {
      store.commit('files/setSelectedFiles', selectedFiles.value.filter((f: FileI) => f.id !== file.id));
    } else {
      selectedFiles.value.push(file);
    }

    lastSelectedIndex.value = index;
    return;
  }

  // Normal click → single selection
  store.commit('files/setSelectedFiles', [file]);
  lastSelectedIndex.value = index;
}

function onDragStart(file: FileI) {
  if (!isSelected(file)) {
    store.commit('files/setSelectedFiles', [file]);
  }

  draggedFile.value = file;
}

function onDragEnter(folderId: number | string) {
  draggedFolder.value = folderId;
}

function onDragLeave() {
  draggedFolder.value = null;
}

async function getFolders() {
  await store.dispatch('folders/filter', {
    query: '',
    page: 1,
    folderId: '',
  });
}

async function getFiles() {
  await store.dispatch('files/filter', {
    query: '',
    page: 1,
    orderBy: 'created',
    order: sortOrder.value,
    folderId: '',
  });
}

async function onDrop(folder: FolderI) {
  if (selectedFiles.value.length === 0) return;

  if (!draggedFile.value) return;

  const folderId = folder.id as number;

  const payload: FileI[] = selectedFiles.value.map((file: FileI) => ({
    ...file,
    folderId,
  }));

  console.log('payload', payload);

  await store.dispatch('files/moveFilesToFolder', payload);

  store.commit('files/setSelectedFiles', []);

  draggedFile.value = null;
  draggedFolder.value = null;

  getFiles();
  getFolders();
}

async function downloadFile(file: FileI) {
  await store.dispatch('files/downloadFile', file);
}

onMounted(() => {
  getFolders();
  getFiles();
  // when scrolling to bottom, load more results
  // window.addEventListener('scroll', getMoreResults);
});

onUnmounted(() => {
  // TODO: validate pagination
  // window.removeEventListener('scroll', getMoreResults);
});

</script>
<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.35s ease,
    opacity 0.25s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 1;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px; /* suficiente para tu contenido */
  opacity: 1;
}
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
