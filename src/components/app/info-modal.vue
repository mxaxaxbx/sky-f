<template>
  <Modal :modelValue="!!modelValue" size="xl" @update:modelValue="$emit('close')" @click.stop>
    <template #header>
      <div v-if="modelValue" class="w-full">
        <!-- icons + title -->
        <div class="flex items-center w-[90%] gap-2">
          <img :src="getFileIcon(modelValue)" alt="file icon" class="h-12 w-12" />
          <!-- title -->
          <h3 v-if="modelValue.id" class="font-regular text-white text-lg w-[90%] break-all sm:text-xl">
            {{ modelValue.name }}
          </h3>
        </div>
      </div>
    </template>

    <template #content>
      <div
        v-if="modelValue"
        class="
          grid grid-cols-1 pb-2 px-3
          gap-3

          sm:grid-cols-2 sm:gap-6
        "
      >
        <!-- size -->
        <div class="flex-col items-center justify-between gap-2">
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">Size:</h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ formatFileSize(Number(modelValue.size)) }}
          </p>
        </div>
        <!-- Type -->
        <div class="flex-col items-center justify-between gap-2">
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">Type:</h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ formatContentType(modelValue.contentType, modelValue.name) }}
          </p>
        </div>
        <!-- Date uploaded -->
        <div class="flex-col items-center justify-between gap-2">
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
            Date uploaded:
          </h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ moment(modelValue.created * 1000).format('DD/MM/YYYY HH:mm a') }}
          </p>
          <p class="text-sm font-light text-[var(--text-terceary)]">
            {{ moment(modelValue.created * 1000).fromNow() }}
          </p>
        </div>
        <!-- Last modification -->
        <div class="flex-col items-center justify-between gap-2">
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">
            Last modification:
            </h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ moment(modelValue.updated * 1000).format('DD/MM/YYYY HH:mm a') }}
          </p>
          <p class="text-sm font-light text-[var(--text-terceary)]">
            {{ moment(modelValue.updated * 1000).fromNow() }}
          </p>
        </div>
        <!-- Dimensions -->
        <div v-if="dimensions" class="flex-col items-center justify-between gap-2">
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">Dimensions:</h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ dimensions.width }} x {{ dimensions.height }}
          </p>
          <p class="text-sm font-light text-[var(--text-terceary)]">
            Pixels
          </p>
        </div>
        <!-- Duration -->
        <div
          v-if="modelValue.contentType?.startsWith('video/') || modelValue.contentType?.startsWith('audio/')"
          class="flex-col items-center justify-between gap-2"
        >
          <h3 class="text-xs font-semibold text-[var(--text-terceary)]">Duration:</h3>
          <p class="text-xl font-light text-[var(--text)]">
            {{ formatTime(duration || 0) }}
          </p>
          <p class="text-sm font-light text-[var(--text-terceary)]">
            Minutes
          </p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import moment from 'moment';
import Modal from '@/components/global/modal.vue';
import { FileI } from '@/store/files/state';

defineProps<{
  modelValue: FileI | null;
  dimensions?: { width: number; height: number } | null;
  duration?: number;
}>();

defineEmits(['close']);

function formatTime(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getFileIcon(file: FileI) {
  if (file.contentType === 'application/pdf') return '/icon/icon-pdf.svg';
  if (file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '/icon/icon-doc.svg';
  if (file.contentType === 'application/vnd.ms-excel' || file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return '/icon/icon-excel.svg';
  if (file.contentType === 'application/vnd.ms-powerpoint' || file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return '/icon/icon-ppt.svg';
  if (/image\/(png|webp|gif|avif)/.test(file.contentType)) return '/icon/icon-png.svg';
  if (file.contentType === 'image/svg+xml') return '/icon/icon-svg.svg';
  if (/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)) return '/icon/icon-img.svg';
  if (/^video\//.test(file.contentType)) return '/icon/icon-video.svg';
  if (/^audio\//.test(file.contentType)) return '/icon/icon-audio.svg';
  if (
    file.name?.toLowerCase().endsWith('.zip')
    || file.name?.toLowerCase().endsWith('.rar')
    || file.name?.toLowerCase().endsWith('.7z')
    || file.name?.toLowerCase().endsWith('.tar')
    || file.name?.toLowerCase().endsWith('.gz')
    || file.name?.toLowerCase().endsWith('.bz2')
  ) return '/icon/icon-compress.svg';
  return '/icon/icon-file.svg';
}

function formatFileSize(size: number): string {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${parseFloat((size / k ** i).toFixed(2))} ${sizes[i]}`;
}

function formatContentType(type: string, name: string): string {
  if (type.includes('pdf')) return 'Portable Document Format (PDF)';
  if (type.includes('msword') || type.includes('wordprocessingml')) return 'Microsoft Word Document';
  if (type.includes('ms-excel') || type.includes('spreadsheetml')) return 'Microsoft Excel Spreadsheet';
  if (type.includes('ms-powerpoint') || type.includes('presentationml')) return 'Microsoft PowerPoint Presentation';
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Audio';
  if (name.endsWith('.zip') || name.endsWith('.rar')) return 'Compressed Archive';
  return 'File';
}
</script>
