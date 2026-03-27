<template>
  <div class=" container w-full mx-auto pt-16 px-4 sm:px-8 font-sans">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <i class="fas fa-spinner fa-spin text-4xl text-[var(--color-primary)]"></i>
    </div>

    <!-- File details -->
    <div v-else-if="file.id" class="max-w-4xl mx-auto">
      <!-- Main card -->
      <div
        class="
          relative
          bg-[var(--bg-secondary)] w-full
          border border-[var(--border)]
          rounded-2xl
          shadow-lg
        "
      >
        <!-- close button -->
      <button
        @click="$router.back()"
        class="
          absolute right-3 top-1
          text-md
          text-[var(--text-terceary)]
          hover:text-[var(--text)]
          transition-colors duration-200
        "
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
        <!-- Header section -->
        <div
          class="
            flex flex-col items-start
            gap-4 p-4
            border-b border-[var(--border)]

            sm:flex-row
            sm:items-center
            ">
          <!-- File icon -->
          <div class="flex-shrink-0">
            <img
              v-if="file.contentType === 'application/pdf'"
              src="/icon/icon-pdf.svg"
              alt="PDF file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="
                file.contentType === 'application/msword' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              "
              src="/icon/icon-doc.svg"
              alt="Word file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="
                file.contentType === 'application/vnd.ms-excel' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              "
              src="/icon/icon-excel.svg"
              alt="Excel file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="
                file.contentType === 'application/vnd.ms-powerpoint' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
              "
              src="/icon/icon-ppt.svg"
              alt="PowerPoint file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
              src="/icon/icon-png.svg"
              alt="Image file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="file.contentType === 'image/svg+xml'"
              src="/icon/icon-svg.svg"
              alt="SVG file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
              src="/icon/icon-img.svg"
              alt="Image file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="/^video\//.test(file.contentType)"
              src="/icon/icon-video.svg"
              alt="Video file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="file.contentType === 'application/zip'"
              src="/icon/icon-zip.svg"
              alt="ZIP file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else-if="/^audio\//.test(file.contentType)"
              src="/icon/icon-audio.svg"
              alt="Audio file icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
            <img
              v-else
              src="/icon/icon-file.svg"
              alt="File icon"
              class="w-16 h-16 sm:w-40 sm:h-40"
            />
          </div>

          <!-- File name and actions -->
          <div class="flex-1 w-full">
            <div class="flex items-start min-w-0 gap-1 overflow-hidden">
              <!-- MODO NORMAL -->
              <h1
                v-if="editingFileId !== file.id"
                class="
                  flex-1
                  min-w-0
                  text-lg md:text-2xl font-semibold
                  text-[var(--text)]
                  mb-2
                  break-words whitespace-normal
                  overflow-hidden
                "
              >
                {{ file.name }}
              </h1>

              <!-- MODO EDICIÓN -->
              <input
                v-else
                :data-file-id="file.id"
                v-model="editedFileName"
                @keyup.enter="saveFileName(file)"
                @blur="saveFileName(file)"
                class="
                  flex-1
                  min-w-0
                  text-lg md:text-2xl font-semibold
                  text-[var(--text)]
                  bg-transparent
                  border-b border-[var(--color-primary)]
                  break-words whitespace-normal
                  outline-none
                  mb-2
                "
              />
              <button
                class="
                  flex-shrink-0
                  p-1
                  grayscale
                  border border-transparent
                  rounded-xl

                  hover:border-[var(--color-primary)]
                  hover:grayscale-0
                  transition-all duration-300 ease-in-out
                  cursor-pointer
                "
                @click="startEditingFile(file)"
              >
                <img
                  src="/icon/icon-edit.svg"
                  alt="edit"
                  class="cursor-pointer h-5"
                />
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <!--preview buttom-->
              <button
                @click="store.dispatch('files/previewFile', file)"
                class="
                  inline-flex items-center gap-1
                  bg-[var(--bg-secondary)]
                  border border-[var(--color-primary)]
                  text-[var(--color-primary)] text-sm font-medium
                  p-1
                  rounded-xl grayscale

                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:text-[var(--text)]
                  hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                  focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  focus:grayscale-0
                  transition-all duration-300
                "
              >
                <img src="/icon/icon-preview.svg" alt="download" class="h-5"/>
                <span class="hidden md:inline pr-1">Preview</span>
              </button>

              <!-- Copy link button -->
              <button
                @click="copyLink(file)"
                class="
                  inline-flex items-center gap-1
                  bg-[var(--bg-secondary)]
                  border border-[var(--color-primary)]
                  text-[var(--color-primary)] font-medium text-sm
                  p-1
                  rounded-xl grayscale

                  hover:bg-[var(--hover-bg)]
                  hover:text-[var(--text)]
                  hover:grayscale-0
                  hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                  focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  focus:grayscale-0
                  transition-all duration-300
                "
              >
                <img src="/icon/icon-link.svg" alt="download" class="h-5 -rotate-45"/>
                <span class="hidden sm:inline pr-1">{{ copied ? 'Copied!' : 'Copy link' }}</span>
              </button>

              <!-- Download button -->
              <button
                @click="downloadFile"
                :disabled="!file.uploadCompleted || downloading"
                class="
                  group relative
                  inline-flex items-center gap-1
                  bg-[var(--bg-secondary)]
                  border border-[var(--color-primary)]
                  text-[var(--color-primary)] text-sm font-medium
                  p-1
                  rounded-xl
                  grayscale

                  hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  hover:text-[var(--color-primary)]
                  focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  hover:grayscale-0
                  focus:grayscale-0
                  transition-all duration-300

                  disabled:opacity-100 disabled:cursor-not-allowed
                  overflow-hidden
                "
              >
                <i v-if="downloading" class="fas fa-spinner fa-spin text-white"></i>
                <img
                  v-else
                  src="/icon/icon_download_2.svg"
                  alt="download" class="h-5 z-0 sm:z-10"
                />
                <span class="relative z-0 pr-1 hidden sm:inline sm:z-10">
                  {{ downloading ? 'Downloading...' : 'Download' }}
                </span>
                <span
                  class="
                    absolute inset-0
                    bg-[var(--hover-bg)]
                    rounded-full
                    transition-transform duration-300 ease-in-out
                    transform -translate-x-full
                    group-hover:translate-x-0
                  "
                >
                </span>
              </button>

              <!--Delete button-->
              <button
                @click.stop="selectItem($event, 'file', file, index); moveToTrash(); $router.back();"
                class="
                  btn-delete
                  inline-flex items-center gap-2
                  bg-[var(--bg-secondary)]
                  border border-[var(--delete-color)]
                  text-[var(--delete-color)] font-medium text-sm
                  p-1
                  rounded-xl
                  grayscale opacity-60

                  hover:bg-[var(--delete-bg)]
                  hover:text-[var(--delete-color)]
                  hover:grayscale-0 hover:opacity-100

                  focus:grayscale-0
                  transition-all duration-300
                "
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5">
                  <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#FFC506"/>
                  </mask>
                  <g mask="url(#mask0_1676_2)">
                  <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                    3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                    4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
                  </g>
                </svg>

                <span class="pr-1">Delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="file.error"
          class="
            mb-6 p-4
            bg-red-500/20 border border-red-500/30
            rounded-xl
            text-red-400 text-sm
          "
        >
          <div class="flex items-start gap-3">
            <i class="fas fa-exclamation-circle mt-0.5"></i>
            <div>
              <p class="font-semibold mb-1">Error</p>
              <p>{{ file.error }}</p>
            </div>
          </div>
        </div>

        <!-- File information grid -->
        <div
          class="
            grid grid-cols-1
            gap-3 p-4

            sm:grid-cols-2 sm:gap-6
          "
        >
          <!-- File size -->
          <div
            class="px-3 py-2"
          >
            <div class="flex-col items-center justify-between gap-2">
              <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
                Size:
              </h3>
              <p class="text-xl font-light text-[var(--text)]">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>

          <!-- Content type -->
          <div
            class="px-3 py-2"
          >
          <div class="flex-col items-center justify-between gap-2">
            <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
                Type:
              </h3>
            </div>
            <p class="text-xl font-light text-[var(--text)]">
              {{ file.contentType }}
            </p>
          </div>

          <!-- Created date -->
          <div
            class="px-3 py-2"
          >
          <div class="flex-col items-center justify-between gap-2">
              <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
                Creation date:
              </h3>
            </div>
            <p class="text-xl font-light text-[var(--text)]">
              {{ moment(file.created * 1000).format('DD/MM/YYYY HH:mm a') }}
            </p>
            <p class="text-sm font-light text-[var(--text-terceary)]">
              {{ moment(file.created * 1000).fromNow() }}
            </p>
          </div>

          <!-- Updated date -->
          <div
            class="px-3 py-2"
          >
          <div class="flex-col items-center justify-between gap-2">
            <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
              Last modification:
              </h3>
            </div>
            <p class="text-xl font-light text-[var(--text)]">
              {{ moment(file.updated * 1000).format('DD/MM/YYYY HH:mm a') }}
            </p>
            <p class="text-sm font-light text-[var(--text-terceary)]">
              {{ moment(file.updated * 1000).fromNow() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <i class="fas fa-file text-6xl text-[var(--text-terceary)] mb-4"></i>
      <p class="text-lg text-[var(--text-secondary)]">
        No se encontró información del archivo
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  nextTick,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI } from '@/store/files/state';
import { FolderI } from '@/store/folders/state';

const store = useStore();
const route = useRoute();

const sortOrder = ref<'desc' | 'asc'>('desc');
const loading = ref(false);
const downloading = ref(false);
const copied = ref(false);
const editingFileId = ref<number | null>(null);
const editedFileName = ref('');
const lastSelectedIndex = ref<number | null>(null);

const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolders = computed<FolderI[]>(() => store.state.folders.selectedFolders);
const file = computed<FileI>(() => store.state.files.file);

const isSelectedFolder = (item: FolderI) => selectedFolders.value.some((f: FolderI) => f.id === item.id);

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

const openFile = (currentFile: FileI) => {
  window.open(currentFile.url, '_blank');
};

const copyLink = async (f: FileI) => {
  try {
    const url = await store.dispatch('files/getDownloadUrl', f);

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (error) {
    console.error('Error al copiar:', error);
  }
};

async function downloadFile() {
  if (!file.value.uploadCompleted) {
    return;
  }

  downloading.value = true;
  try {
    await store.dispatch('files/downloadFile', file.value);
  } catch (error) {
    console.error(error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al descargar el archivo',
    });
  } finally {
    downloading.value = false;
  }
}

async function getFileDetails() {
  loading.value = true;
  try {
    await store.dispatch('files/getFileDetails', route.params.id as string);
  } catch (error) {
    console.log(error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los detalles del archivo',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getFileDetails();
});

// rename file
async function startEditingFile(currentFile: FileI) {
  editingFileId.value = currentFile.id;

  // Mostrar nombre completo
  editedFileName.value = currentFile.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-file-id="${currentFile.id}"]`,
  ) as HTMLInputElement | null;

  if (!input) return;

  input.focus();

  const lastDotIndex = currentFile.name.lastIndexOf('.');

  if (lastDotIndex > 0) {
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

    await store.dispatch('files/getFileDetails', currentFile.id);
  } catch (error) {
    console.error(error);
  } finally {
    editingFileId.value = null;
  }
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
</script>
<style scoped>
.btn-delete:hover {
  box-shadow: var(--delete-shadow);
}
</style>
