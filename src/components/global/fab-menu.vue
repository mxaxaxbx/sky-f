<template>
  <Transition name="fab">
    <div
      v-show="showFab"
      class="fixed bottom-2 right-3 sm:hidden z-10"
    >
      <Dropdown
        :classes="[
          'bg-[var(--bg-modal-2)]',
          'backdrop-blur-md',
          'border border-[var(--border)]',
          'rounded-t-2xl',
          'absolute', '-right-3', '-bottom-2', 'z-20',
          dropdownPosition,
          'w-screen',
        ]"
      >
        <template #trigger="{ toggle, close }">
          <button
            @click="toggleDropdown(close, toggle, $event)"
            class="
              flex items-center justify-center
              bg-[#0A77F3]
              text-white text-md font-medium
              shadow-sm h-12 w-12
              rounded-full
              cursor-pointer
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300 ease-in-out
            "
          >
            <img src="/icon/icon-add.svg" alt="icon" class="h-8 w-8" />
          </button>
        </template>
        <template #content="{}">
          <div class="flex flex-col gap-0.5 pt-2 font-medium text-sm text-[var(--color-primary)]">
            <div class="grid grid-cols-3 flex items-center gap-2 mx-2 mb-2">
              <label
                for="fileInputBtn"
                class="
                  flex flex-col items-center justify-center
                  rounded-xl px-2 py-1 border border-transparent
                  grayscale w-full h-full
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300"
              >
                <img src="/icon/icon-upload.svg" alt="upload" class="h-6"/>
                <span>Upload files</span>
              </label>
              <!--Upload img-->
              <button
                type="button"
                @click="$emit('scan')"
                class="
                  flex flex-col items-center justify-center
                  rounded-xl px-2 py-1 border border-transparent
                  grayscale w-full h-full
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300"
              >
                <img src="/icon/icon-upload-img.svg" alt="scan" class="h-6"/>
                <span>upload photos</span>
              </button>
              <!--scan document-->
              <button
                type="button"
                @click="$emit('scan')"
                class="
                  flex flex-col items-center justify-center
                  rounded-xl px-2 py-1 border border-transparent
                  grayscale w-full h-full
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300"
              >
                <img src="/icon/icon-scan.svg" alt="scan" class="h-6"/>
                <span>Scan pages</span>
              </button>
            </div>
            <div class="h-px bg-[var(--border)] w-full"></div>

            <div class="flex flex-col px-0 w-full text-base">
              <!--record sound-->
              <!-- //-- inicia boton grabacion// -->
              <button
                @click="openRecorder"
                class="
                  flex items-center justify-start
                  rounded-xl mx-2 mb-2 mt-1 px-4 py-2 border border-transparent
                  grayscale
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                <img src="/icon/icon-mic.svg" alt="icon" class="h-6 mr-4" />
                <span>Record audio</span>
              </button>
              <!-- //-- termina boton grabacion// -->

              <div class="h-px bg-[var(--border)] w-full opacity-50"></div>

              <!--create a folder-->
              <button
                type="button"
                @click="$emit('createFolder')"
                class="
                  flex items-center justify-start
                  rounded-xl m-2 px-4 py-2 border border-transparent
                  grayscale
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300"
              >
                <img src="/icon/icon-new-folder.svg" alt="newFolder" class="h-6 mr-4"/>
                <span>Create a folder</span>
              </button>

              <div class="h-px bg-[var(--border)] w-full opacity-50"></div>

              <button
                @click="$emit('createGroup')"
                class="
                  flex items-center justify-start
                  rounded-xl mx-2 my-2 px-4 py-2 border border-transparent
                  grayscale
                  hover:bg-[var(--hover-bg)]
                  hover:grayscale-0
                  hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                <img src="/icon/icon-isle.svg" alt="icon" class="h-6 mr-4" />
                Create a group
              </button>
            </div>
          </div>
        </template>
      </Dropdown>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ref,
  defineAsyncComponent,
  nextTick,
  onMounted,
  onBeforeUnmount,
  defineProps,
  defineEmits,
} from 'vue';
import { useStore } from 'vuex';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const props = defineProps({
  currentFolderId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(['scan', 'createFolder', 'createGroup']);

const store = useStore();
const showFab = ref(true);
const dropdownPosition = ref('top-8');
const activeDropdownClose = ref<(() => void) | null>(null);

function openRecorder() {
  store.commit('setRecorder', { show: true, folderId: props.currentFolderId });
  if (activeDropdownClose.value) activeDropdownClose.value();
}

const toggleDropdown = async (close: () => void, toggle: () => void, event?: MouseEvent) => {
  if (event) event.stopPropagation();
  activeDropdownClose.value = close;
  toggle();
  await nextTick();
  const middle = window.innerHeight / 2;
  const y = event?.clientY || 0;
  dropdownPosition.value = y > middle ? 'bottom-8' : 'top-8';
};

let lastScroll = 0;
let scrollTarget: Window | Element = window;

const handleScroll = () => {
  const current = scrollTarget === window ? window.scrollY : (scrollTarget as Element).scrollTop;
  const threshold = 10;
  const offset = 50;

  if (current <= offset) {
    showFab.value = true;
  } else if (current > lastScroll + threshold) {
    showFab.value = false;
    // Close dropdown when scrolling down
    if (activeDropdownClose.value) {
      activeDropdownClose.value();
    }
  } else if (current < lastScroll - threshold) {
    showFab.value = true;
  }
  lastScroll = current;
};

onMounted(() => {
  scrollTarget = document.querySelector('.overflow-auto, .overflow-y-auto') || window;
  lastScroll = scrollTarget === window ? window.scrollY : (scrollTarget as Element).scrollTop;
  scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  scrollTarget.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
