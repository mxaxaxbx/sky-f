<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      class="upload-panel-container fixed bottom-4 right-4 z-50 w-[400px] rounded-2xl shadow-lg border border-[var(--border)] bg-[var(--bg-modal)] backdrop-blur-md divide-y divide-[var(--border)] overflow-hidden"
      style="view-transition-name: upload-panel"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between transition-all duration-300 relative"
        :class="minimized ? 'px-3 py-1' : 'px-4 py-3'"
      >
        <div class="flex items-center gap-3">
            <div v-if="minimized && !allDone" class="relative h-10 w-10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" class="h-full w-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" fill="transparent" class="text-white/10" />
                <circle
                  cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" fill="transparent"
                  stroke-dasharray="113.1" :stroke-dashoffset="113.1 * (1 - uploadProgress / 100)"
                  class="text-[var(--primary,#0B77F3)] transition-all duration-500 ease-out"
                  stroke-linecap="round"
                />
              </svg>
              <span class="absolute text-[10px] font-semibold text-[var(--text)]">{{ Math.round(uploadProgress) }}%</span>
            </div>
            <img
              v-if="minimized && allDone"
              src="/icon/icon-success.svg"
              alt="done"
              class="h-7 w-7"
            />
            <div class=" flex flex-col items-start">
              <!-- Título solo cuando está expandido -->
              <span v-if="!minimized" class="text-md font-semibold text-[var(--text)]">
                Uploads
              </span>

              <!-- Estado solo cuando está minimizado -->
              <template v-if="minimized">
                <span class="text-md font-semibold text-[var(--text)]">
                  {{ allDone ? 'Upload complete' : 'Uploading...' }}
                </span>
                <div class="flex items-start justify-between text-[12px] text-[var(--text-terceary)]">
                  <span>{{ doneCount }} / {{ uploadFiles.length }}<span class="ml-2">uploads complete</span></span>
                  <span v-if="errorCount > 0" class="text-red-500 ml-8">{{ errorCount }} failed</span>
                </div>
              </template>
            </div>
        </div>
        <div class="flex items-center gap-2 absolute"
        :class="minimized ? 'right-2 top-2' : 'right-1.5 top-1.5'"
        style="view-transition-name: action-buttons"
        >
          <button
            @click="toggleMinimize"
            class="
              p-1
              text-sm border border-transparent rounded-xl
              text-[var(--text-terceary)]
              bg-transparent
              hover:text-[var(--color-primary)]
              hover:border-[var(--color-primary)]

              transition-all duration-300
            "
          >
            <i :class="minimized ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="m-1" />
          </button>
          <button
            @click="dismiss"
            class="
              px-1 py-0.5
              text-md border border-transparent rounded-xl
              text-[var(--text-terceary)]
              bg-transparent
              hover:text-[var(--color-primary)]
              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

              transition-all duration-300
            "
          >
            <i class="fa-solid fa-xmark m-1"></i>
          </button>
        </div>
      </div>

      <!-- Content Wrapper -->
      <div v-if="!minimized" class="divide-y divide-[var(--border)]">
        <!-- Uploading Section -->
        <div v-if="uploadingFiles.length > 0" class="flex flex-col">
          <div class="bg-transparent px-4 pt-3 pb-1 text-sm tracking-wider text-[var(--text-terceary)] font-semibold">
            Uploading
          </div>
          <div
            class="max-h-48 overflow-y-auto custom-scrollbar relative"
            @scroll="handleSectionScroll('uploading', $event)"
            :style="{
              maskImage: sectionScrolls.uploading > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none',
              webkitMaskImage: sectionScrolls.uploading > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none'
            }"
          >
            <div
              v-for="(file, index) in uploadingFiles"
              :key="'uploading-' + index"
              class="px-4 py-2"
            >
              <div class="flex items-center gap-2 mb-2">
                <!-- Reloj -->
                <svg class="h-5 w-5 shrink-0 text-[var(--text-terceary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <circle cx="12" cy="12" r="9" class="" />
                  <line x1="12" y1="12" x2="12" y2="6" /> <!-- Manecilla fija a las 12 -->
                  <line x1="12" y1="12" x2="12" y2="7" class="clock-hand-spin" /> <!-- Manecilla giratoria -->
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /> <!-- Centro -->
                </svg>
                <div class="flex-1 min-w-0 flex flex-col">
                  <span class="text-sm text-[var(--text)] font-medium truncate flex-1 min-w-0" :title="file.name">
                    {{ file.name }}
                  </span>
                  <span class="text-[12px] text-[var(--text-terceary)]">
                    Uploading {{ formatFileSize((file.percentage / 100) * file.size) }} / {{ formatFileSize(file.size) }}
                  </span>
                </div>
              </div>
              <div class="h-0.5 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300 ease-out bg-[var(--primary,#0B77F3)]"
                  :style="{ width: `${file.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Success Section -->
        <div v-if="successFiles.length > 0" class="flex flex-col">
          <div class="bg-transparent px-4 pt-3 pb-1 text-sm tracking-wider text-[var(--text-terceary)] font-semibold">
            Uploaded to Files
          </div>
          <div
            class="max-h-60 overflow-y-auto custom-scrollbar relative"
            @scroll="handleSectionScroll('success', $event)"
            :style="{
              maskImage: sectionScrolls.success > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none',
              webkitMaskImage: sectionScrolls.success > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none'
            }"
          >
            <div
              v-for="(file, index) in successFiles"
              :key="'success-' + index"
              class="px-4 py-2 group hover:bg-white/5 cursor-pointer transition-colors focus:outline-none focus:bg-white/5"
              @click="handleOpenFile(file)"
              @keydown.enter="handleOpenFile(file)"
              tabindex="0"
            >
              <div class="flex gap-3 items-center">
                <div class="relative shrink-0">
                  <img
                    :src="getFileIcon(file)"
                    alt="file icon"
                    class="h-8 w-8"
                  />
                  <div class="absolute bottom-0 -right-0.5 bg-[var(--bg)] rounded-full shadow-sm">
                    <img src="/icon/icon-success.svg" alt="done" class="h-3.5 w-3.5" />
                  </div>
                </div>
                <div class="flex flex-col items-start w-full min-w-0">
                  <span class="text-sm text-[var(--text)] font-medium truncate w-full group-hover:underline" :title="file.name">
                    {{ file.name }}
                  </span>
                  <span class="text-[12px] text-[var(--text-terceary)]">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Failed Section -->
        <div v-if="failedFiles.length > 0" class="flex flex-col mb-2">
          <div class="bg-transparent px-4 pt-3 text-sm tracking-wider text-red-500 font-semibold">
            Failed to upload
          </div>
          <div
            class="max-h-40 overflow-y-auto custom-scrollbar relative"
            @scroll="handleSectionScroll('failed', $event)"
            :style="{
              maskImage: sectionScrolls.failed > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none',
              webkitMaskImage: sectionScrolls.failed > 0
                ? `linear-gradient(to bottom, transparent 0px, black 40px)`
                : 'none'
            }"
          >
            <div
              v-for="(file, index) in failedFiles"
              :key="'failed-' + index"
              class="px-4 py-2 transition-colors"
            >
              <div class="flex gap-3 items-center">
                <div class="relative shrink-0">
                  <img
                    :src="getFileIcon(file)"
                    alt="file icon"
                    class="h-8 w-8 opacity-50 grayscale"
                  />
                  <div class="absolute bottom-0 -right-0.5 bg-[var(--bg)] rounded-full shadow-sm">
                    <img src="/icon/icon-error.svg" alt="error" class="h-3.5 w-3.5 opacity-80" />
                  </div>
                </div>
                <div class="flex flex-col items-start w-full min-w-0">
                  <span class="text-sm text-[var(--text)] font-medium truncate w-full" :title="file.name">
                    {{ file.name }}
                  </span>
                  <span class="text-[12px] text-red-500">{{ file.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary footer -->
      <div
        v-if="!minimized"
        class="px-4 py-2 flex items-center gap-3 border-t border-[var(--border)]"
      >
        <!-- Icono de estado (Circular Progress) -->
        <div v-if="!allDone" class="relative h-10 w-10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 48 48" class="h-full w-full transform -rotate-90">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" fill="transparent" class="text-[var(--border)]" />
            <circle
              cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" fill="transparent"
              stroke-dasharray="113.1" :stroke-dashoffset="113.1 * (1 - uploadProgress / 100)"
              class="text-[var(--primary,#0B77F3)] transition-all duration-500 ease-out"
              stroke-linecap="round"
            />
          </svg>
          <span class="absolute text-[10px] font-semibold text-[var(--text)]">{{ Math.round(uploadProgress) }}%</span>
        </div>
        <img
          v-else
          src="/icon/icon-success.svg"
          alt="done"
          class="h-7 w-7"
        />

        <!-- Textos de estado -->
        <div class="flex flex-col items-start">
          <span class="text-md font-semibold text-[var(--text)]">
            {{ allDone ? 'Upload complete' : 'Uploading...' }}
          </span>
          <div class="flex items-start justify-between text-[12px] text-[var(--text-terceary)]">
            <span>{{ doneCount }} / {{ uploadFiles.length }}<span class="ml-2">uploads complete</span></span>
            <span v-if="errorCount > 0" class="text-red-500 ml-8">{{ errorCount }} failed</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  computed, ref, watch,
} from 'vue';
import { useStore } from 'vuex';

import { UplaodFileI } from '@/store/files/state';

const store = useStore();

const STORAGE_KEY = 'uploadPanel:minimized';

const dismissed = ref(false);

// estado persistido
const minimized = ref(
  localStorage.getItem(STORAGE_KEY) === 'true',
);

// guardar cambios en localStorage
watch(minimized, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val));
});

const uploadFiles = computed<UplaodFileI[]>(() => [
  ...store.state.files.uploadFiles,
  /*
  {
    id: 'test-id',
    name: 'Archivo_de_prueba.pdf',
    percentage: 35,
    error: null,
    contentType: 'application/pdf',
    created: Date.now() / 1000,
    updated: Date.now() / 1000,
    size: 1024 * 1024 * 15,
  },
  {
    id: 'failed-id',
    name: 'Archivo_con_error.jpg',
    percentage: 45,
    error: 'Error de conexión con el servidor',
    contentType: 'image/jpeg',
    created: Date.now() / 1000,
    updated: Date.now() / 1000,
    size: 1024 * 500,
  },
  */
]);

const uploadProgress = computed(() => {
  // Filtramos solo los archivos que están en proceso de carga
  const activeFiles = uploadFiles.value.filter((f) => f.percentage < 100 && !f.error);

  // Si no hay archivos activos pero hay archivos en la lista, significa que todo terminó
  if (activeFiles.length === 0) {
    return uploadFiles.value.length > 0 ? 100 : 0;
  }

  // Calculamos el progreso basado en el peso (bytes) total de los archivos activos
  // Esto garantiza que el progreso inicie en 0% para nuevas subidas
  const totalSize = activeFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const uploadedSize = activeFiles.reduce((acc, f) => acc + ((f.size || 0) * (f.percentage / 100)), 0);

  return totalSize > 0 ? (uploadedSize / totalSize) * 100 : 0;
});

const uploadingFiles = computed(() => [...uploadFiles.value].reverse().filter((f) => f.percentage < 100 && !f.error));
const successFiles = computed(() => [...uploadFiles.value].reverse().filter((f) => f.percentage === 100 && !f.error));
const failedFiles = computed(() => [...uploadFiles.value].reverse().filter((f) => !!f.error));

const sectionScrolls = ref({
  uploading: 0,
  success: 0,
  failed: 0,
});

function handleSectionScroll(section: 'uploading' | 'success' | 'failed', event: Event) {
  const target = event.target as HTMLElement;
  sectionScrolls.value[section] = target.scrollTop;
}

const doneCount = computed(() => uploadFiles.value.filter((f) => f.percentage === 100 && !f.error).length);
const errorCount = computed(() => uploadFiles.value.filter((f) => !!f.error).length);
const allDone = computed(
  () => uploadFiles.value.length > 0
    && uploadFiles.value.every((f) => f.percentage === 100 || !!f.error),
);
const visible = computed(() => uploadFiles.value.length > 0 && !dismissed.value);

function toggleMinimize() {
  if (!(document as any).startViewTransition) {
    minimized.value = !minimized.value;
    return;
  }
  (document as any).startViewTransition(() => {
    minimized.value = !minimized.value;
  });
}

function dismiss() {
  dismissed.value = true;
  store.commit('files/clearUploadFiles');
}

watch(
  () => uploadFiles.value.length,
  (newLen, oldLen) => {
    if (newLen > 0 && oldLen === 0) {
      dismissed.value = false;
      // minimized.value = false; // no sobrescribir preferencia
    }
  },
);

watch(allDone, (done) => {
  if (done) {
    // sin auto-dismiss
  }
});

function handleOpenFile(file: UplaodFileI) {
  if (file.error) return;
  // Solo abrimos si tiene un ID válido (ya sincronizado en el store)
  if (file.id) {
    store.commit('files/setActivePreviewFile', file);
    store.commit('files/setPreviewFilesList', [file]);
  }
}

function getFileIcon(file: UplaodFileI): string {
  const { contentType, name } = file;
  if (!contentType) return '/icon/icon-file.svg';

  if (contentType === 'application/pdf') return '/icon/icon-pdf.svg';
  if (contentType === 'application/msword' || contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '/icon/icon-doc.svg';
  if (contentType === 'application/vnd.ms-excel' || contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return '/icon/icon-excel.svg';
  if (contentType === 'application/vnd.ms-powerpoint' || contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return '/icon/icon-ppt.svg';
  if (/image\/(png|webp|gif|avif)/.test(contentType)) return '/icon/icon-png.svg';
  if (contentType === 'image/svg+xml') return '/icon/icon-svg.svg';
  if (/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(contentType)) return '/icon/icon-img.svg';
  if (/^video\//.test(contentType)) return '/icon/icon-video.svg';
  if (/^audio\//.test(contentType)) return '/icon/icon-audio.svg';

  if (
    name?.toLowerCase().endsWith('.zip')
    || name?.toLowerCase().endsWith('.rar')
    || name?.toLowerCase().endsWith('.7z')
    || name?.toLowerCase().endsWith('.tar')
    || name?.toLowerCase().endsWith('.gz')
    || name?.toLowerCase().endsWith('.bz2')
  ) return '/icon/icon-compress.svg';

  return '/icon/icon-file.svg';
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / (k ** i)).toFixed(1))} ${sizes[i]}`;
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes slow-spin {
  from { transform: rotate(-90deg); }
  to { transform: rotate(270deg); }
}
.animate-slow-spin {
  animation: slow-spin 3s linear infinite;
}

@keyframes clock-hand-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.clock-hand-spin {
  animation: clock-hand-rotate 1.5s linear infinite;
  transform-origin: 12px 12px;
}

/* View Transitions */
:deep(.upload-panel-container) {
  view-transition-name: upload-panel;
}

::view-transition-old(upload-panel),
::view-transition-new(upload-panel) {
  height: 100%;
  width: 100%;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

::view-transition-group(root),
::view-transition-group(upload-panel),
::view-transition-group(action-buttons) {
  animation-duration: 300ms;
}
</style>
