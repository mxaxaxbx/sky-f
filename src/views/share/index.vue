<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] px-4 py-10">
    <div
      class="
        w-full max-w-md
        bg-[var(--bg-secondary)]
        border border-[var(--border)]
        rounded-2xl shadow-md
        p-6
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
        <div class="flex flex-col items-center gap-2 text-center mb-6">
          <img
            :src="meta.type === 'folder' ? '/icon/icon-folder.svg' : '/icon/icon-file.svg'"
            :alt="meta.type"
            class="h-14"
          />
          <h1 class="text-xl font-semibold text-[var(--text)] break-all">{{ meta.name }}</h1>
          <p class="text-xs uppercase tracking-wide text-[var(--text-terceary)]">{{ meta.type }}</p>
        </div>

        <!-- password prompt (protected & not yet verified) -->
        <form
          v-if="meta.isPasswordProtected && !accessToken"
          @submit.prevent="verify"
          class="flex flex-col gap-4"
        >
          <label class="text-sm text-[var(--text-terceary)]" for="share-password">
            This content is protected. Enter the password to continue.
          </label>
          <input
            id="share-password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="
              w-full px-3 py-2
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-xl
              text-[var(--text)] text-sm
              outline-none
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
          <button
            @click="download"
            :disabled="downloading"
            class="
              w-full flex items-center justify-center gap-2
              bg-[var(--color-primary)] text-white text-sm font-medium
              px-4 py-2 rounded-full
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300
            "
          >
            <i v-if="downloading" class="fas fa-spinner fa-spin"></i>
            <img v-else src="/icon/icon_download_2.svg" alt="download" class="h-5" />
            <span>{{ downloadLabel }}</span>
          </button>

          <!-- file list -->
          <ul v-if="sharedFiles.length" class="flex flex-col gap-2">
            <li
              v-for="file in sharedFiles"
              :key="file.id"
              class="
                flex items-center justify-between gap-2
                px-3 py-2
                bg-[var(--bg)]
                border border-[var(--border)]
                rounded-xl
              "
            >
              <div class="flex flex-col min-w-0">
                <span class="text-sm text-[var(--text)] truncate">{{ resolveName(file) }}</span>
                <span v-if="formatSize(file.size)" class="text-[0.7rem] text-[var(--text-terceary)]">{{ formatSize(file.size) }}</span>
              </div>
              <button
                type="button"
                @click="downloadOne(file)"
                class="
                  text-[var(--color-primary)]
                  hover:text-[var(--text)]
                  transition-colors duration-300
                "
                title="Download"
              >
                <i class="fas fa-download" aria-hidden="true"></i>
                <span class="sr-only">Download {{ file.name }}</span>
              </button>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
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
  if (sharedFiles.value.length) return 'Download again';
  return meta.value?.type === 'file' ? 'Download' : 'Get files';
});

function formatSize(bytes: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}

// Single-file shares return only a URL, so fall back to the share name.
function resolveName(file: SharedFileI): string {
  return file.name || meta.value?.name || 'download';
}

async function loadMeta(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    meta.value = await store.dispatch('shares/getPublicShareMeta', token);
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
