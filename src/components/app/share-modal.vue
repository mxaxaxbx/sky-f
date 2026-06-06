<template>
  <Modal :modelValue="!!modelValue" size="md" @update:modelValue="$emit('close')" @click.stop>
    <template #header>
      <h3> Copy link:
        <p class="font-normal text-sm mt-2 break-all w-[90%]">
          {{ modelValue?.name }}
        </p>
      </h3>
    </template>

    <template #content>
      <div class="flex flex-col gap-4">
        <!-- Input and Copy Button -->
        <div
          class="
            flex group p-0.5
            bg-[var(--bg)]
            border border-[var(--color-primary)]
            rounded-xl
            shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            transition-all duration-300 ease-in-out
          "
          :class="{ 'opacity-60 pointer-events-none': !createdShare }"
        >
          <input
            :value="createdShare ? shareUrl : 'Generating link...'"
            readonly
            class="
              w-full flex-1
              text-xs text-[var(--text)]
              pr-1 pl-2 py-1
              bg-transparent rounded-full select-all
              focus:outline-none
            "
            @focus="e => createdShare && (e.target as HTMLInputElement).select()"
          />
          <button
            type="button"
            :disabled="!createdShare || copied"
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
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            :class="copied ? 'bg-[var(--color-primary)] text-white shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]' : ''"
          >
            <i v-if="!createdShare" class="fas fa-spinner fa-spin mr-1"></i>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -rotate-45">
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
            {{ !createdShare ? 'Creating...' : (copied ? 'Copied!' : 'Copy link') }}
          </button>
        </div>
        <!-- Settings toggle and badges summary -->
        <div v-if="createdShare" class="flex flex-col items-center justify-between gap-3">
          <!-- summary badges -->
          <div class="flex flex-wrap items-center gap-2 w-full px-1">
            <button
              type="button"
              @click="togglePasswordSettings"
              class="
                flex items-center gap-2 px-2 py-1 rounded-xl font-medium
                border bg-[var(--bg)] text-xs
                hover:border-[var(--color-primary)] hover:text-[var(--text)]
                transition-all duration-200 cursor-pointer
              "
              :class="savedUsePassword ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'text-[var(--text-terceary)] border-[var(--border)]'"
            >
              <i class="fa-solid text-xs" :class="savedUsePassword ? 'fa-lock' : 'fa-lock-open'"></i>
              {{ savedUsePassword ? ' Password protected' : 'Public' }}
            </button>
            <button
              type="button"
              @click="toggleExpirationSettings"
              class="
                flex items-center gap-2 px-2 py-1 rounded-xl font-medium
                border bg-[var(--bg)] text-xs
                hover:border-[var(--color-primary)] hover:text-[var(--text)]
                transition-all duration-200 cursor-pointer
              "
              :class="savedExpiresAt ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'text-[var(--text-terceary)] border-[var(--border)]'"
            >
              <i class="fa-regular fa-clock text-xs"></i>
              {{ savedExpiresAt ? `Expires ${formatDate(savedExpiresAt)}` : 'No expiration' }}
            </button>
          </div>
        </div>
        <!-- Password Settings Panel -->
        <transition
          enter-active-class="transition-all duration-300 ease-out overflow-hidden"
          leave-active-class="transition-all duration-200 ease-in overflow-hidden"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[500px]"
          leave-from-class="opacity-100 max-h-[500px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="showPasswordSettings && createdShare" class="flex flex-col gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl -mt-2">
            <!-- password protection -->
            <div class="flex flex-col gap-2">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-[var(--text)] font-medium">
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

            <!-- Save Settings Button -->
            <div class="flex justify-end gap-2 mt-1">
              <button
                type="button"
                @click="savePasswordSettings"
                :disabled="savingSettings || (usePassword && !password.trim())"
                class="
                  flex items-center gap-2
                  text-white text-xs font-semibold
                  border border-[var(--color-primary)] bg-[var(--color-primary)]
                  rounded-full px-3.5 py-1.5
                  hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
                  transition-all duration-300
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                <i v-if="savingSettings" class="fas fa-spinner fa-spin"></i>
                Save settings
              </button>
            </div>
          </div>
        </transition>

        <!-- Expiration Settings Panel -->
        <transition
          enter-active-class="transition-all duration-300 ease-out overflow-hidden"
          leave-active-class="transition-all duration-200 ease-in overflow-hidden"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[500px]"
          leave-from-class="opacity-100 max-h-[500px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="showExpirationSettings && createdShare" class="flex flex-col gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl mt-1">
            <!-- expiration -->
            <div class="flex flex-col gap-2">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="flex items-center gap-2 text-sm text-[var(--text)] font-medium">
                  <i class="fa-regular fa-clock text-[var(--text-terceary)]"></i>
                  Set an expiration date
                </span>
                <input v-model="useExpiration" type="checkbox" class="accent-[var(--color-primary)]" />
              </label>
              <DateTimePicker
                v-if="useExpiration"
                v-model="expiresAt"
                placeholder="Select date and time"
              />
            </div>

            <!-- Save Settings Button -->
            <div class="flex justify-end gap-2 mt-1">
              <button
                type="button"
                @click="saveExpirationSettings"
                :disabled="savingSettings"
                class="
                  flex items-center gap-2
                  text-white text-xs font-semibold
                  border border-[var(--color-primary)] bg-[var(--color-primary)]
                  rounded-full px-3.5 py-1.5
                  hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
                  transition-all duration-300
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                <i v-if="savingSettings" class="fas fa-spinner fa-spin"></i>
                Save settings
              </button>
            </div>
          </div>
        </transition>
        <p
          class="
            flex items-center mx-auto
            font-light text-xs text-center text-[var(--text-terceary)]
            pt-1 mx-1 gap-2
            sm:text-xs
          "
        >
          <img src="/icon/icon-warning.svg" alt="warning" class="h-4 sm:h-4"/>
          Anyone with the link{{ savedUsePassword ? ' and password' : '' }} will be able to download this {{ modelValue?.name ? 'file' : 'item' }}.
        </p>
      </div>
    </template>

    <!-- <template #footer> -->
      <!-- <template v-if="!createdShare">
        <button
          type="button"
          @click="$emit('close')"
          class="hidden
            text-[var(--text-secondary)] text-sm
            border border-[var(--border)] bg-[var(--bg)]
            rounded-full px-3 py-1
            hover:border-[var(--text)]
            hover:bg-[var(--hover-bg-gray)]
            hover:text-[var(--text)]
          "
        >
          Cancel
        </button>
      </template> -->

      <!-- Once link is generated -->
      <!-- <template v-else>
        <button
          type="button"
          @click="revokeShare"
          :disabled="loading"
          class="hidden
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
          class="hidden
            text-white text-sm
            border border-[var(--color-primary)] bg-[var(--color-primary)]
            rounded-full px-3 py-1
            hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
            transition-all duration-300
          "
        >
          Done
        </button>
      </template> -->
    <!-- </template> -->
  </Modal>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, ref, computed, watch,
} from 'vue';
import { useStore } from 'vuex';
import Modal from '@/components/global/modal.vue';
import DateTimePicker from '@/components/global/datetime-picker.vue';
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

const showPasswordSettings = ref(false);
const showExpirationSettings = ref(false);
const savingSettings = ref(false);
const savedUsePassword = ref(false);
const savedExpiresAt = ref<number | null>(null);

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
  showPasswordSettings.value = false;
  showExpirationSettings.value = false;
  savingSettings.value = false;
  savedUsePassword.value = false;
  savedExpiresAt.value = null;
}

async function createShare() {
  if (!props.modelValue) return;
  loading.value = true;
  try {
    const payload = {
      fileId: Number(props.modelValue.id),
      folderId: null as number | null,
      password: null,
      expiresAt: null,
    };
    createdShare.value = await store.dispatch('shares/createShare', payload);
    savedUsePassword.value = false;
    savedExpiresAt.value = null;
  } catch (error: any) {
    store.commit('notifications/addNotification', {
      message: error?.response?.data?.error || 'Unable to create the share link.',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

async function savePasswordSettings() {
  if (!createdShare.value) return;
  savingSettings.value = true;
  try {
    const payload = {
      token: createdShare.value.share.token,
      password: usePassword.value ? password.value : null,
      expiresAt: savedExpiresAt.value,
    };
    const updatedShare = await store.dispatch('shares/updateShare', payload);

    // Update local state
    createdShare.value.share = updatedShare;
    savedUsePassword.value = usePassword.value;

    store.commit('notifications/addNotification', {
      message: 'Password settings updated successfully.',
      type: 'success',
    });

    showPasswordSettings.value = false;
  } catch (error: any) {
    store.commit('notifications/addNotification', {
      message: error?.response?.data?.error || 'Unable to update password settings.',
      type: 'error',
    });
  } finally {
    savingSettings.value = false;
  }
}

async function saveExpirationSettings() {
  if (!createdShare.value) return;
  savingSettings.value = true;
  try {
    const targetExpiresAt = useExpiration.value && expiresAt.value
      ? Math.floor(new Date(expiresAt.value).getTime() / 1000)
      : null;
    const payload = {
      token: createdShare.value.share.token,
      expiresAt: targetExpiresAt,
    };
    const updatedShare = await store.dispatch('shares/updateShare', payload);

    // Update local state
    createdShare.value.share = updatedShare;
    savedExpiresAt.value = targetExpiresAt;

    store.commit('notifications/addNotification', {
      message: 'Expiration settings updated successfully.',
      type: 'success',
    });

    showExpirationSettings.value = false;
  } catch (error: any) {
    store.commit('notifications/addNotification', {
      message: error?.response?.data?.error || 'Unable to update expiration settings.',
      type: 'error',
    });
  } finally {
    savingSettings.value = false;
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

function togglePasswordSettings() {
  if (showPasswordSettings.value) {
    showPasswordSettings.value = false;
  } else {
    // Sync password input with saved value
    usePassword.value = savedUsePassword.value;

    showPasswordSettings.value = true;
    showExpirationSettings.value = false;

    // Auto-check password protection if opening and it's currently Public
    if (!savedUsePassword.value) {
      usePassword.value = true;
    }
  }
}

function toggleExpirationSettings() {
  if (showExpirationSettings.value) {
    showExpirationSettings.value = false;
  } else {
    // Sync expiration input with saved value (DateTimePicker uses YYYY-MM-DDTHH:mm)
    useExpiration.value = savedExpiresAt.value !== null;
    if (savedExpiresAt.value) {
      const date = new Date(savedExpiresAt.value * 1000);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      expiresAt.value = localDate.toISOString().slice(0, 16);
    } else {
      expiresAt.value = '';
    }

    showExpirationSettings.value = true;
    showPasswordSettings.value = false;

    // Auto-check expiration if opening and it's currently No expiration
    if (savedExpiresAt.value === null) {
      useExpiration.value = true;
    }
  }
}

// reset state and automatically generate share link every time a new file is shared
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    resetForm();
    createShare();
  }
}, { immediate: true });
</script>
