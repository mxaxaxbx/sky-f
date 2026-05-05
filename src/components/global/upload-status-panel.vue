<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 z-50 w-80 rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div class="flex items-center gap-2">
          <i
            v-if="!allDone"
            class="fas fa-cloud-upload-alt text-[var(--primary,#0B77F3)] text-sm animate-pulse"
          />
          <i v-else class="fas fa-check-circle text-green-500 text-sm" />
          <span class="text-sm font-semibold text-[var(--text)]">
            {{ allDone ? 'Upload complete' : 'Uploading...' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="minimized = !minimized"
            class="text-[var(--text-secondary)] hover:text-[var(--text)] transition p-1"
          >
            <i :class="minimized ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs" />
          </button>
          <button
            @click="dismiss"
            class="text-[var(--text-secondary)] hover:text-[var(--text)] transition p-1"
          >
            <i class="fas fa-times text-xs" />
          </button>
        </div>
      </div>

      <!-- File list -->
      <div v-if="!minimized" class="max-h-60 overflow-y-auto">
        <div
          v-for="(file, index) in uploadFiles"
          :key="index"
          class="px-4 py-2 border-b border-[var(--border)] last:border-0"
        >
          <div class="flex items-center gap-2 mb-1">
            <i :class="fileIcon(file.contentType)" class="text-[var(--primary,#0B77F3)] text-sm w-4 shrink-0" />
            <span class="text-xs text-[var(--text)] truncate flex-1" :title="file.name">
              {{ file.name }}
            </span>
            <span class="text-xs shrink-0 ml-1">
              <span v-if="file.error" class="text-red-500">Error</span>
              <span v-else-if="file.percentage === 100" class="text-green-500">Done</span>
              <span v-else class="text-[var(--text-secondary)]">{{ file.percentage }}%</span>
            </span>
          </div>
          <div class="h-1 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300 ease-out"
              :class="{
                'bg-red-500': !!file.error,
                'bg-green-500': !file.error && file.percentage === 100,
                'bg-[var(--primary,#0B77F3)]': !file.error && file.percentage < 100,
              }"
              :style="{ width: `${file.error ? 100 : file.percentage}%` }"
            />
          </div>
          <p v-if="file.error" class="text-[10px] text-red-500 mt-0.5 truncate">{{ file.error }}</p>
        </div>
      </div>

      <!-- Summary footer -->
      <div
        v-if="!minimized"
        class="px-4 py-2 flex items-center justify-between text-xs text-[var(--text-secondary)]"
      >
        <span>{{ doneCount }} / {{ uploadFiles.length }} uploaded</span>
        <span v-if="errorCount > 0" class="text-red-500">{{ errorCount }} failed</span>
        <span v-else-if="allDone" class="text-green-500">All done</span>
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

const dismissed = ref(false);
const minimized = ref(false);
let autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

const uploadFiles = computed<UplaodFileI[]>(() => store.state.files.uploadFiles);

const doneCount = computed(() => uploadFiles.value.filter((f) => f.percentage === 100 && !f.error).length);
const errorCount = computed(() => uploadFiles.value.filter((f) => !!f.error).length);
const allDone = computed(
  () => uploadFiles.value.length > 0
    && uploadFiles.value.every((f) => f.percentage === 100 || !!f.error),
);
const visible = computed(() => uploadFiles.value.length > 0 && !dismissed.value);

function dismiss() {
  dismissed.value = true;
  store.commit('files/clearUploadFiles');
}

watch(
  () => uploadFiles.value.length,
  (newLen, oldLen) => {
    if (newLen > 0 && oldLen === 0) {
      dismissed.value = false;
      minimized.value = false;
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    }
  },
);

watch(allDone, (done) => {
  if (done) {
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
    autoDismissTimer = setTimeout(() => {
      dismiss();
    }, 4000);
  }
});

function fileIcon(contentType: string): string {
  if (!contentType) return 'fas fa-file';
  if (contentType.startsWith('image/')) return 'fas fa-file-image';
  if (contentType.startsWith('video/')) return 'fas fa-file-video';
  if (contentType.startsWith('audio/')) return 'fas fa-file-audio';
  if (contentType === 'application/pdf') return 'fas fa-file-pdf';
  if (contentType.startsWith('text/')) return 'fas fa-file-alt';
  if (
    contentType.includes('zip')
    || contentType.includes('rar')
    || contentType.includes('tar')
    || contentType.includes('gzip')
  ) return 'fas fa-file-archive';
  if (
    contentType.includes('spreadsheet')
    || contentType.includes('excel')
    || contentType.includes('csv')
  ) return 'fas fa-file-excel';
  if (
    contentType.includes('wordprocessing')
    || contentType.includes('word')
    || contentType.includes('msword')
  ) return 'fas fa-file-word';
  if (
    contentType.includes('presentation')
    || contentType.includes('powerpoint')
  ) return 'fas fa-file-powerpoint';
  return 'fas fa-file';
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
</style>
