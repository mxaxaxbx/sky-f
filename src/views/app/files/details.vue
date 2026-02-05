<template>
  <div class=" container w-full p-2">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <i class="fas fa-spinner fa-spin text-4xl text-[var(--color-primary)]"></i>
    </div>

    <!-- File details -->
    <div v-else-if="file.id" class="max-w-4xl mx-auto">
      <!-- Back button -->
      <button
        @click="$router.back()"
        class="
          flex items-center gap-2
          mb-6
          text-[var(--text-terceary)]
          hover:text-[var(--text)]
          transition-colors duration-200
        "
      >
        <i class="fas fa-arrow-left"></i>
        <span class="text-md font-regular">back</span>
      </button>

      <!-- Main card -->
      <div
        class="
          bg-[var(--bg-secondary)] w-full
          border border-[var(--border)]
          rounded-2xl
          shadow-lg
        "
      >
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
          <div class="flex-1 min-w-0">
            <h1
              class="
                text-xl sm:text-2xl font-semibold
                text-[var(--text)]
                mb-2
                break-words
              "
            >
              {{ file.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-4">
              <!-- Upload status badge -->
              <!-- Download button -->
              <button
                @click="downloadFile"
                :disabled="!file.uploadCompleted || downloading"
                class="
                  group relative
                  inline-flex items-center gap-2
                  bg-[var(--color-primary)]
                  border border-[var(--color-primary)]
                  text-white
                  px-2 py-0.5
                  rounded-full
                  text-xs
                  hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:shadow-none
                  overflow-hidden
                "
              >
              <i
                v-if="downloading"
                class="fas fa-spinner fa-spin h-5 w-5 text-white z-10"
              ></i>

              <!-- icono normal -->
              <img
                v-else
                src="/icon/icon_download.svg"
                alt="download"
                class="h-4 w-4 z-10"
              />
                <span class="relative z-10 font-light">
                  {{ downloading ? 'Descargando...' : 'Descargar' }}
                </span>
                <span
                  class="
                    absolute inset-0 z-0
                    bg-[var(--hover-bg)]
                    rounded-full
                    transition-transform duration-300 ease-in-out
                    transform -translate-x-full
                    group-hover:translate-x-0
                  "
                ></span>
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
            gap-6 p-4

            sm:grid-cols-2
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
              {{ moment(file.created * 1000).format('DD/MM/YYYY HH:mm') }}
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
              {{ moment(file.updated * 1000).format('DD/MM/YYYY HH:mm') }}
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
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI } from '@/store/files/state';

const store = useStore();
const route = useRoute();

const file = computed<FileI>(() => store.state.files.file);
const loading = ref(false);
const downloading = ref(false);

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

async function downloadFile() {
  if (!file.value.uploadCompleted) {
    return;
  }

  downloading.value = true;
  try {
    await store.dispatch('files/getDownloadUrl', file.value);
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
</script>
