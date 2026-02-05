<template>
  <div class="w-full pb-4 pt-0 px-0 mt-20 sm:mt-0 sm:pt-2 sm:px-3">
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
          text-[var(--text-secondary)]
          hover:text-[var(--color-primary)]
          transition-colors duration-300
        "
      >
        <i class="fas fa-arrow-left"></i>
        <span class="text-sm font-medium">Volver</span>
      </button>

      <!-- Main card -->
      <div
        class="
          bg-[var(--bg-secondary)]
          border border-[var(--border)]
          rounded-2xl
          p-6 sm:p-8
          shadow-lg
        "
      >
        <!-- Header section -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-[var(--border)]">
          <!-- File icon -->
          <div class="flex-shrink-0">
            <img
              v-if="file.contentType === 'application/pdf'"
              src="/icon/icon-pdf.svg"
              alt="PDF file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="
                file.contentType === 'application/msword' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              "
              src="/icon/icon-doc.svg"
              alt="Word file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="
                file.contentType === 'application/vnd.ms-excel' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              "
              src="/icon/icon-excel.svg"
              alt="Excel file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="
                file.contentType === 'application/vnd.ms-powerpoint' ||
                file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
              "
              src="/icon/icon-ppt.svg"
              alt="PowerPoint file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
              src="/icon/icon-png.svg"
              alt="Image file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="file.contentType === 'image/svg+xml'"
              src="/icon/icon-svg.svg"
              alt="SVG file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
              src="/icon/icon-img.svg"
              alt="Image file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="/^video\//.test(file.contentType)"
              src="/icon/icon-video.svg"
              alt="Video file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="file.contentType === 'application/zip'"
              src="/icon/icon-zip.svg"
              alt="ZIP file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else-if="/^audio\//.test(file.contentType)"
              src="/icon/icon-audio.svg"
              alt="Audio file icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <img
              v-else
              src="/icon/icon-file.svg"
              alt="File icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
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
                  px-3 py-1
                  rounded-full
                  text-xs font-regular
                  hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:shadow-none
                  overflow-hidden
                "
              >
                <img
                  alt="do"
                  :src="downloading
                    ? '/icon/icon_download.svg'
                    : '/icon/icon_download.svg'"
                    class="h-4"
                />
                <span class="relative z-10">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- File size -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-weight text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                Tamaño
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ formatFileSize(file.size) }}
            </p>
          </div>

          <!-- Content type -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-file-alt text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                Tipo de archivo
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ file.contentType }}
            </p>
          </div>

          <!-- Created date -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-calendar-plus text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                Fecha de creación
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ moment(file.created * 1000).format('DD/MM/YYYY HH:mm') }}
            </p>
            <p class="text-xs text-[var(--text-terceary)] mt-1">
              {{ moment(file.created * 1000).fromNow() }}
            </p>
          </div>

          <!-- Updated date -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-calendar-check text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                Última actualización
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ moment(file.updated * 1000).format('DD/MM/YYYY HH:mm') }}
            </p>
            <p class="text-xs text-[var(--text-terceary)] mt-1">
              {{ moment(file.updated * 1000).fromNow() }}
            </p>
          </div>

          <!-- File ID -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-hashtag text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                ID del archivo
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ file.id }}
            </p>
          </div>

          <!-- User ID -->
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
          >
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-user text-[var(--color-primary)]"></i>
              <h3 class="text-sm font-semibold text-[var(--text-secondary)]">
                ID de usuario
              </h3>
            </div>
            <p class="text-lg font-semibold text-[var(--text)]">
              {{ file.userId }}
            </p>
          </div>
        </div>

        <!-- Storage information -->
        <div
          v-if="file.r2Key"
          class="
            mt-6 pt-6
            border-t border-[var(--border)]
          "
        >
          <h3 class="text-sm font-semibold text-[var(--text-secondary)] mb-4">
            Información de almacenamiento
          </h3>
          <div
            class="
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              p-4
            "
          >
            <div class="space-y-2">
              <div>
                <p class="text-xs text-[var(--text-terceary)] mb-1">
                  R2 Key
                </p>
                <p
                  class="
                    text-sm text-[var(--text)]
                    font-mono
                    break-all
                    bg-[var(--bg-secondary)]
                    p-2 rounded
                  "
                >
                  {{ file.r2Key }}
                </p>
              </div>
            </div>
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
