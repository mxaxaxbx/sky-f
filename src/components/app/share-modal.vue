<template>
  <Modal :modelValue="!!modelValue" size="md" @update:modelValue="$emit('close')" @click.stop>
    <template #header>
      <h3> Share link:
        <p class="font-normal text-sm mt-2 break-all w-[90%]">
          {{ modelValue?.name }}
        </p>
      </h3>
    </template>

    <template #content>
      <!-- CONFIGURE: link not created yet -->
      <form
        v-if="!createdShare"
        id="create-share-form"
        @submit.prevent="createShare"
        class="flex flex-col gap-4"
      >
        <!-- password protection -->
        <div class="flex flex-col gap-2">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="flex items-center gap-2 text-sm text-[var(--text)]">
              <i class="fa-solid fa-lock text-[var(--text-terceary)]"></i>
              Password protection
            </span>
            <input v-model="usePassword" type="checkbox" class="accent-[var(--color-primary)]" />
          </label>
          <input
            v-if="usePassword"
            v-model="password"
            type="password"
            placeholder="Set a password"
            class="
              w-full px-3 py-1.5
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-full
              text-sm text-[var(--text)]
              placeholder:text-[var(--text-terceary)]
              focus:border-[var(--color-primary)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300
            "
          />
        </div>

        <!-- expiration -->
        <div class="flex flex-col gap-2">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="flex items-center gap-2 text-sm text-[var(--text)]">
              <i class="fa-regular fa-clock text-[var(--text-terceary)]"></i>
              Set an expiration date
            </span>
            <input v-model="useExpiration" type="checkbox" class="accent-[var(--color-primary)]" />
          </label>
          <input
            v-if="useExpiration"
            v-model="expiresAt"
            type="datetime-local"
            :min="minDateTime"
            class="
              w-full px-3 py-1.5
              bg-[var(--bg)]
              border border-[var(--border)]
              rounded-full
              text-sm text-[var(--text)]
              focus:border-[var(--color-primary)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300
            "
          />
        </div>
      </form>

      <!-- CREATED: show link + management -->
      <div v-else class="flex flex-col gap-3">
        <div
          class="
            flex group p-0.5
            bg-[var(--bg)]
            border border-[var(--color-primary)]
            rounded-xl
            shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            transition-all duration-300 ease-in-out
          "
        >
          <input
            :value="shareUrl"
            readonly
            class="
              w-full flex-1
              text-xs text-[var(--text)]
              pr-1 pl-2 py-1
              bg-transparent rounded-full select-all
              focus:outline-none
            "
            @focus="e => (e.target as HTMLInputElement).select()"
          />
          <button
            type="button"
            @click.stop="tryCopy"
            class="
              flex items-center px-2 gap-1
              text-[var(--text)] text-sm font-medium
              bg-[var(--bg-secondary)]
              border border-[var(--color-primary)]
              rounded-lg
              hover:bg-[var(--color-primary)] hover:text-white
              hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
              transition-all duration-300 ease-in-out
            "
            :class="copied ? 'bg-[var(--color-primary)] text-white shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]' : ''"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -rotate-45">
              <mask id="mask0_1677_12" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24"/>
              </mask>
              <g mask="url(#mask0_1677_12)">
              <path d="M11 17H7C5.61667 17 4.4375 16.5125 3.4625 15.5375C2.4875 14.5625 2 13.3833 2 12C2 10.6167
                2.4875 9.4375 3.4625 8.4625C4.4375 7.4875 5.61667 7 7 7H11V9H7C6.16667 9 5.45833 9.29167
                4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833
                14.7083 6.16667 15 7 15H11V17ZM8 13V11H16V13H8ZM13 17V15H17C17.8333 15 18.5417
                14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583
                19.125 9.875C18.5417 9.29167 17.8333 9 17 9H13V7H17C18.3833 7 19.5625 7.4875 20.5375
                8.4625C21.5125 9.4375 22 10.6167 22 12C22 13.3833 21.5125 14.5625 20.5375 15.5375C19.5625
                16.5125 18.3833 17 17 17H13Z"/>
              </g>
            </svg>
            {{ copied ? 'Copied!' : 'Copy link' }}
          </button>
        </div>

        <!-- summary -->
        <div class="flex flex-wrap items-center gap-2 text-xs text-[var(--text-terceary)] px-1">
          <span
            class="
              flex items-center gap-1 px-2 py-0.5 rounded-full
              border border-[var(--border)] bg-[var(--bg)]
            "
          >
            <i class="fa-solid" :class="usePassword ? 'fa-lock' : 'fa-lock-open'"></i>
            {{ usePassword ? 'Password protected' : 'Public' }}
          </span>
          <span
            class="
              flex items-center gap-1 px-2 py-0.5 rounded-full
              border border-[var(--border)] bg-[var(--bg)]
            "
          >
            <i class="fa-regular fa-clock"></i>
            {{ createdShare.share.expiresAt ? `Expires ${formatDate(createdShare.share.expiresAt)}` : 'No expiration' }}
          </span>
        </div>

        <p
          class="
            flex items-center
            font-light text-xs text-center text-[var(--text-terceary)]
            py-1 mx-1 gap-2
            sm:text-sm
          "
        >
          <img src="/icon/icon-warning.svg" alt="warning" class="h-4 sm:h-5"/>
          Anyone with the link{{ usePassword ? ' and password' : '' }} will be able to download this {{ modelValue?.name ? 'file' : 'item' }}.
        </p>
      </div>
    </template>

    <template #footer>
      <!-- configure footer -->
      <template v-if="!createdShare">
        <button
          type="button"
          @click="$emit('close')"
          class="
            text-[var(--text-secondary)] text-sm
            border border-[var(--border)] bg-[var(--bg)]
            rounded-full px-3
            hover:border-[var(--text)]
            hover:bg-[var(--hover-bg-gray)]
            hover:text-[var(--text)]
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          form="create-share-form"
          :disabled="loading || (usePassword && !password.trim())"
          class="
            flex items-center gap-2
            text-white text-sm
            border rounded-full px-3 py-1
            transition
          "
          :class="loading || (usePassword && !password.trim())
            ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)] text-[var(--text)]'
            : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          Create link
        </button>
      </template>

      <!-- created footer -->
      <template v-else>
        <button
          type="button"
          @click="revokeShare"
          :disabled="loading"
          class="
            flex items-center gap-2
            text-[var(--delete-color)] text-sm
            border border-[var(--border)] bg-[var(--bg)]
            rounded-full px-3 py-1
            hover:bg-[var(--delete-bg)]
            hover:border-[var(--delete-color)]
            transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-link-slash"></i>
          Revoke link
        </button>
        <button
          type="button"
          @click="$emit('close')"
          class="
            text-white text-sm
            border border-[var(--color-primary)] bg-[var(--color-primary)]
            rounded-full px-3 py-1
            hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
            transition-all duration-300
          "
        >
          Done
        </button>
      </template>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, ref, computed, watch,
} from 'vue';
import { useStore } from 'vuex';
import Modal from '@/components/global/modal.vue';
import { FileI } from '@/store/files/state';
import { CreatedShareI } from '@/store/shares/state';

const props = defineProps<{
  modelValue: FileI | null;
}>();

const emit = defineEmits(['close']);
const store = useStore();

const usePassword = ref(false);
const password = ref('');
const useExpiration = ref(false);
const expiresAt = ref('');

const loading = ref(false);
const copied = ref(false);
const createdShare = ref<CreatedShareI | null>(null);

// minimum selectable datetime is "now" (local), formatted for datetime-local input
const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});

const shareUrl = computed(() => (createdShare.value
  ? `${window.location.origin}${createdShare.value.url}`
  : ''));

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString();
}

function resetForm() {
  usePassword.value = false;
  password.value = '';
  useExpiration.value = false;
  expiresAt.value = '';
  copied.value = false;
  createdShare.value = null;
}

// reset state every time a new file is shared
watch(() => props.modelValue, (newVal) => {
  if (newVal) resetForm();
}, { immediate: true });

async function createShare() {
  if (!props.modelValue) return;
  loading.value = true;
  try {
    const payload = {
      fileId: Number(props.modelValue.id),
      folderId: null as number | null,
      password: usePassword.value ? password.value : null,
      expiresAt: useExpiration.value && expiresAt.value
        ? Math.floor(new Date(expiresAt.value).getTime() / 1000)
        : null,
    };
    createdShare.value = await store.dispatch('shares/createShare', payload);
  } catch (error: any) {
    store.commit('notifications/addNotification', {
      message: error?.response?.data?.error || 'Unable to create the share link.',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

async function revokeShare() {
  if (!createdShare.value) return;
  loading.value = true;
  try {
    await store.dispatch('shares/revokeShare', createdShare.value.share.token);
    store.commit('notifications/addNotification', {
      message: 'Share link revoked.',
      type: 'success',
    });
    emit('close');
  } catch (error: any) {
    store.commit('notifications/addNotification', {
      message: error?.response?.data?.error || 'Unable to revoke the share link.',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

async function tryCopy() {
  if (!shareUrl.value) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error('Error copying:', error);
  }
}
</script>
