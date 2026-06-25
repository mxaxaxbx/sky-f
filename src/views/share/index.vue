<template>
  <div class="min-h-screen w-full flex items-center justify-center px-4 py-10">
    <div
      class="
        w-full max-w-md
        bg-[var(--bg-secondary)]
        border border-[var(--border)]
        rounded-2xl shadow-md
        p-1
      "
    >
      <!-- loading metadata -->
      <div v-if="loading" class="flex flex-col items-center gap-4 py-10 text-[var(--color-primary)]">
        <i class="fas fa-spinner fa-spin text-3xl"></i>
        <p class="text-sm text-[var(--text-terceary)]">Loading shared content...</p>
      </div>

      <!-- error / not found -->
      <div v-else-if="error" class="flex flex-col items-center gap-4 py-10 text-center">
        <i class="fas fa-triangle-exclamation text-3xl text-[var(--delete-color)]"></i>
        <h1 class="text-lg font-semibold text-[var(--text)]">This link is not available</h1>
        <p class="text-sm text-[var(--text-terceary)]">{{ error }}</p>
      </div>

      <!-- share content -->
      <template v-else-if="meta">
        <!-- header -->
        <div class="flex items-center w-full gap-2 mb-4 justify-start">
            <img
              :src="getFileIcon(meta.name, meta.type)"
              :alt="meta.type"
              class="h-12"
            />
            <h1 class="text-xl font-semibold text-[var(--text)] break-all">{{ meta.name }}</h1>
        </div>

        <!-- password prompt (protected & not yet verified) -->
        <form
          v-if="meta.isPasswordProtected && !accessToken"
          @submit.prevent="verify"
          class="flex flex-col gap-4 m-2"
        >
          <label class="text-xs text-[var(--text-terceary)] mx-2" for="share-password">
            This content is protected. Enter the password to continue.
          </label>
          <input
            id="share-password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="
              w-full px-3 py-1
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-full
              text-[var(--text)] text-sm
              outline-none
              placeholder:text-[var(--text-terceary)]

              focus:border-[var(--color-primary)]
              transition-colors duration-300
            "
            />
          <p v-if="verifyError" class="text-xs text-[var(--delete-color)]">{{ verifyError }}</p>
          <button
            type="submit"
            :disabled="verifying || !password"
            class="
              w-full flex items-center justify-center gap-2
              bg-[var(--color-primary)] text-white text-sm font-medium
              px-4 py-2 rounded-full
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300
            "
          >
            <i v-if="verifying" class="fas fa-spinner fa-spin"></i>
            <span>Unlock</span>
          </button>
        </form>

        <!-- download (public or already verified) -->
        <div v-else class="flex flex-col gap-4">
          <!-- file list -->
          <ul v-if="sharedFiles.length" class="flex flex-col gap-2">
            <li
              v-for="file in sharedFiles"
              :key="file.id"
              class="
                flex items-center justify-end gap-1
              "
              :class="{ '': store.state.files.activePreviewFile?.id === 'shared-' + file.id }"
              tabindex="0"
            >
                <button
                  type="button"
                  @click="openPreview(file)"
                  @keydown.enter="openPreview(file)"
                  class="
                    border border-[var(--color-primary)]
                    text-[var(--color-primary)] font-medium text-sm
                    p-1
                    rounded-xl
                    opacity-70
                    grayscale

                    hover:opacity-100
                    hover:grayscale-0
                    hover:text-[var(--text)]
                    hover:border-[var(--color-primary)]

                    focus:hover:border-[var(--color-primary)]
                    focus:grayscale-0
                    transition-all duration-300
                  "
                  title="Preview"
                  >
                      <img src="/icon/icon-preview.svg" alt="preview"
                        class="h-5 w-5"/>
                </button>

                <button
                  @click="download"
                  :disabled="downloading"
                  class="
                    border border-[var(--color-primary)]
                    text-[var(--color-primary)] font-medium text-sm
                    p-1
                    rounded-xl
                    opacity-70
                    grayscale

                    hover:opacity-100
                    hover:grayscale-0
                    hover:text-[var(--text)]
                    hover:border-[var(--color-primary)]

                    focus:hover:border-[var(--color-primary)]
                    focus:grayscale-0
                    transition-all duration-300
                  "
                    >
                  <i v-if="downloading" class="fas fa-spinner fa-spin"></i>
                  <img v-else src="/icon/icon_download_2.svg" alt="download" class="h-5" />
                  <span>{{ downloadLabel }}</span>
                </button>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import { PublicShareMetaI, SharedFileI } from '@/store/shares/state';

const route = useRoute();
const store = useStore();

const token = route.params.token as string;

const loading = ref(true);
const error = ref('');
const meta = ref<PublicShareMetaI | null>(null);

const password = ref('');
const verifying = ref(false);
const verifyError = ref('');

const downloading = ref(false);

const accessToken = computed<string>(() => store.state.shares.accessToken);
const sharedFiles = computed<SharedFileI[]>(() => store.state.shares.sharedFiles);

const downloadLabel = computed(() => {
  if (sharedFiles.value.length) return '';
  return meta.value?.type === 'file' ? 'Download' : 'Get files';
});

// Single-file shares return only a URL, so fall back to the share name.
function resolveName(file: SharedFileI): string {
  return file.name || meta.value?.name || 'download';
}

function deduceContentType(name: string): string {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.endsWith('.pdf')) return 'application/pdf';
  if (lowerName.endsWith('.doc')) return 'application/msword';
  if (lowerName.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lowerName.endsWith('.xls')) return 'application/vnd.ms-excel';
  if (lowerName.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (lowerName.endsWith('.ppt')) return 'application/vnd.ms-powerpoint';
  if (lowerName.endsWith('.pptx')) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  if (lowerName.endsWith('.png')) return 'image/png';
  if (lowerName.endsWith('.webp')) return 'image/webp';
  if (lowerName.endsWith('.gif')) return 'image/gif';
  if (lowerName.endsWith('.avif')) return 'image/avif';
  if (lowerName.endsWith('.svg')) return 'image/svg+xml';
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return 'image/jpeg';
  if (lowerName.endsWith('.bmp')) return 'image/bmp';
  if (lowerName.endsWith('.mp4')) return 'video/mp4';
  if (lowerName.endsWith('.webm')) return 'video/webm';
  if (lowerName.endsWith('.ogg')) return 'video/ogg';
  if (lowerName.endsWith('.mp3')) return 'audio/mpeg';
  if (lowerName.endsWith('.wav')) return 'audio/wav';
  if (lowerName.endsWith('.txt')) return 'text/plain';
  if (lowerName.endsWith('.html')) return 'text/html';
  if (lowerName.endsWith('.css')) return 'text/css';
  if (lowerName.endsWith('.js')) return 'application/javascript';
  if (lowerName.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

function mapSharedFileToFile(file: SharedFileI): any {
  return {
    id: `shared-${file.id}`,
    name: resolveName(file),
    size: file.size || 0,
    contentType: deduceContentType(resolveName(file)),
    url: file.url,
    userId: 0,
    r2Key: '',
    r2Url: '',
    uploadCompleted: true,
    error: '',
    folderId: null,
    created: 0,
    updated: 0,
  };
}

function openPreview(file: SharedFileI): void {
  const mappedList = sharedFiles.value.map(mapSharedFileToFile);
  const mappedActive = mapSharedFileToFile(file);
  store.commit('files/setPreviewFilesList', mappedList);
  store.commit('files/setActivePreviewFile', mappedActive);
}

function formatSize(bytes: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}

function getFileIcon(name: string, type?: string): string {
  if (type === 'folder') return '/icon/icon-folder.svg';

  const lowerName = (name || '').toLowerCase();
  if (lowerName.endsWith('.pdf')) return '/icon/icon-pdf.svg';
  if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return '/icon/icon-doc.svg';
  if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) return '/icon/icon-excel.svg';
  if (lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx')) return '/icon/icon-ppt.svg';
  if (/\.(png|webp|gif|avif)$/.test(lowerName)) return '/icon/icon-png.svg';
  if (lowerName.endsWith('.svg')) return '/icon/icon-svg.svg';
  if (/\.(jpe?g|jpg|bmp|tiff|heic|heif|ico)$/.test(lowerName)) return '/icon/icon-img.svg';
  if (/\.(mp4|webm|ogg|mov|mkv|avi|flv|wmv)$/.test(lowerName)) return '/icon/icon-video.svg';
  if (/\.(mp3|wav|ogg|flac|aac|m4a|wma)$/.test(lowerName)) return '/icon/icon-audio.svg';
  if (
    lowerName.endsWith('.zip')
    || lowerName.endsWith('.rar')
    || lowerName.endsWith('.7z')
    || lowerName.endsWith('.tar')
    || lowerName.endsWith('.gz')
    || lowerName.endsWith('.bz2')
  ) return '/icon/icon-compress.svg';

  return '/icon/icon-file.svg';
}

async function fetchSharedFiles(): Promise<void> {
  try {
    const files = await store.dispatch('shares/downloadShare', { token });
    if (meta.value?.type === 'file' && files && files.length === 1) {
      openPreview(files[0]);
    }
  } catch (err: any) {
    console.error('Error fetching shared files:', err);
  }
}

async function loadMeta(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    meta.value = await store.dispatch('shares/getPublicShareMeta', token);
    if (meta.value && !meta.value.isPasswordProtected) {
      await fetchSharedFiles();
    }
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'The link may have expired or been revoked.';
  } finally {
    loading.value = false;
  }
}

async function verify(): Promise<void> {
  verifying.value = true;
  verifyError.value = '';
  try {
    await store.dispatch('shares/verifyShare', { token, password: password.value });
    await fetchSharedFiles();
  } catch (err: any) {
    verifyError.value = err?.response?.data?.error || 'Incorrect password. Please try again.';
  } finally {
    verifying.value = false;
  }
}

// Fetch the signed URL as a blob and trigger a real browser download.
// Cross-origin (R2) URLs ignore the anchor `download` attribute, so we
// download the bytes ourselves and serve them from an object URL.
async function triggerBrowserDownload(file: SharedFileI): Promise<void> {
  try {
    const blob = await fetch(file.url).then((r) => r.blob());
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = resolveName(file);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    // CORS or network failure: fall back to opening the signed URL directly
    console.warn('Falling back to direct URL download', err);
    window.open(file.url, '_blank');
  }
}

async function downloadOne(file: SharedFileI): Promise<void> {
  await triggerBrowserDownload(file);
}

async function download(): Promise<void> {
  downloading.value = true;
  try {
    const files: SharedFileI[] = await store.dispatch('shares/downloadShare', { token });

    if (!files.length) {
      store.commit('notifications/addNotification', {
        message: 'There are no files available in this share.',
        type: 'error',
      });
      return;
    }

    // A single file downloads immediately; multiple files are listed
    // so the recipient can pick which ones to download.
    if (files.length === 1) {
      await triggerBrowserDownload(files[0]);
    }
  } catch (err: any) {
    store.commit('notifications/addNotification', {
      message: err?.response?.data?.error || 'Unable to download the shared content.',
      type: 'error',
    });
  } finally {
    downloading.value = false;
  }
}

onMounted(loadMeta);
</script>
