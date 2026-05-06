<template>
  <Modal :modelValue="!!modelValue" size="md" @update:modelValue="$emit('close')" @click.stop>
    <template #header>
      <h3 class=""> Copy link:
        <p class="font-normal text-sm mt-2 break-all w-[90%]">
          {{ modelValue?.name }}
        </p>
      </h3>
    </template>

    <template #content>
      <div class="flex flex-col gap-3">
        <div
          class="
            flex
            group
            p-0.5
            bg-[var(--bg)]
            border border-[var(--color-primary)]
            rounded-xl

            hover:bg-[var(--bg-hover)]
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
              bg-transparent
              rounded-full
              select-all
              focus:outline-none
            "
            @focus="e => (e.target as HTMLInputElement).select()"
          />
          <button
            type="button"
            @click.stop="tryCopy"
            class="
              flex items-center
              px-2 gap-1
              text-[var(--text)] text-sm font-medium
              bg-[var(--bg-secondary)]
              border border-[var(--color-primary)]

              hover:bg-[var(--color-primary)]
              hover:text-white
              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
              rounded-lg
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
        <p class="
          flex items-center
          font-light text-xs text-center text-[var(--text-terceary)]
          py-2 mx-2 gap-2

          sm:text-sm
          "
        >
          <img src="/icon/icon-warning.svg" alt="warning" class="h-4 sm:h-5"/>
          Anyone with the link will be able to download the file.
        </p>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import Modal from '@/components/global/modal.vue';
import { FileI } from '@/store/files/state';

const props = defineProps<{
  modelValue: FileI | null;
}>();

const emit = defineEmits(['close']);
const store = useStore();

const shareUrl = ref('');
const copied = ref(false);

async function updateShareUrl() {
  if (!props.modelValue) return;
  try {
    const url = await store.dispatch('files/getDownloadUrl', props.modelValue);
    shareUrl.value = url;
  } catch (error) {
    console.error('Error getting share url:', error);
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    updateShareUrl();
    copied.value = false;
  }
}, { immediate: true });

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
