<template>
  <div
    class="
      bg-[var(--bg)]
      font-alexandria font-sans
      pt-14 sm:pt-0
    "
  >
    <div
      class="
        mx-auto
        flex flex-col items-start
        px-0 w-full max-h-screen
        pt-12
        sm:pt-16
      "
    >
    <!--uploap movil-->
      <Transition name="fab">
        <div
          v-show="showFab && !hideBar"
          :class="showSidebar ? 'hidden' : 'inline'"
          class="
            fixed bottom-3 right-3 sm:hidden z-10
          "
        >
          <Dropdown
            :classes="[
              'bg-[var(--bg-secondary)]',
              'border border-[var(--border)]',
              'rounded-2xl',
              'absolute','-right-0', 'bottom-10','z-20',
              dropdownPosition,
              'w-48',
            ]">
              <template #trigger="{ toggle }">
                <button
                  @click="toggleDropdown(toggle, $event)"
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
              <template #content="{ }">
                <div class="flex flex-col gap-0.5 px-1 py-1 font-medium text-md text-[var(--color-primary)]">
                  <label
                    for="fileInputBtn"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent
                      grayscale

                      hover:bg-[var(--hover-bg)]
                      hover:grayscale-0
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300"
                  >
                    <img src="/icon/icon_download_2.svg" alt="newFolder" class="rotate-180 h-6 mr-4"/>
                    <span>Upload</span>
                  </label>
                  <!--create a folder-->
                  <button
                    type="button"
                    @click="createFolderModal = true"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent
                      grayscale

                      hover:bg-[var(--hover-bg)]
                      hover:grayscale-0
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300"
                  >
                    <img src="/icon/icon-new-folder.svg" alt="newFolder" class="h-6 mr-4"/>
                    <span>Create a folder</span>
                  </button>
                </div>
              </template>
          </Dropdown>
        </div>
      </Transition>

      <!-- folder details -->
      <div
        v-if="folderDetails && folderDetails.id"
        class="
          flex justify-between items-center
          w-full
          mx-auto px-2
          sm:px-8
        "
      >
        <div class="flex items-center px-2 gap-1">
          <!-- Back button -->
          <router-link
            to="/app/files"
            class="
              flex items-center
              gap-2
              grayscale
              text-[var(--text-terceary)] font-semibold
              text-xs

              sm:text-md md:text-lg lg:text-xl

              hover:text-[var(--text)] hover:grayscale-0
              transition-colors duration-200
            "
          >
            <img src="/icon/icon-cloudDrive-active.svg" alt="folder" class="h-5 sm:h-6"/>
            Could Drive
          </router-link>
          <span class="text-[var(--text-terceary)] px-1">></span>
          <div class="flex items-center gap-1">
            <img src="/icon/icon-folder.svg" alt="folder" class="h-5 sm:h-6"/>
            <h2
              class="
                font-light text-[var(--text)]
                text-xs

                sm:text-md md:text-lg lg:text-xl
              "
            >
              {{ folderDetails.name }}
            </h2>
          </div>
        </div>
        <div class="mx-4 hidden sm:inline">
          <!-- actions desktop-->

          <div class="flex items-center gap-2">

            <!-- Upload button -->
            <label
              for="fileInputBtn"
              class="
                hidden items-center
                bg-[var(--color-primary)]
                border border-[var(--color-primary)]
                text-white text-sm font-medium
                px-2 py-0.5
                rounded-full

                sm:flex
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300 ease-in-out
                cursor-pointer
              "
            >
              <img src="/icon/icon-upload.svg" alt="icon" class="h-4 mr-2" />
              <span>Upload</span>
            </label>
            <!-- New folder-->
            <button
              @click="createFolderModal = true"
              class="
                hidden items-center
                bg-[var(--bg-secondary)]
                border border-[var(--border)]
                text-[var(--text-terceary)] text-sm font-medium
                pl-2 pr-2.5 py-0.5
                grayscale
                rounded-full

                sm:flex
                hover:grayscale-0
                hover:text-[var(--text)]
                hover:bg-[var(--hover-bg)]
                hover:border-[var(--hover-border)]
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:border-[var(--hover-border)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:grayscale-0
                transition-all duration-300 ease-in-out
                cursor-pointer
              "
            >
              <img src="/icon/icon-new-folder.svg" alt="icon" class="h-5 mr-2" />
              New folder
            </button>

            <div class="flex flex-col items-end justify-end ml-4 hidden lg:inline">
            <!-- Created date -->
            <div class="px-2 flex items-center justify-center gap-2 ">
              <div class="">
                <h3 class="text-[0.6rem] font-regular text-[var(--text-terceary)]">
                  Creation date:
                </h3>
              </div>
              <p class="text-[0.6rem] font-light text-[var(--text)]">
                {{ moment(folderDetails.created * 1000).format('DD/MM/YYYY') }}
              </p>
            </div>

            <!-- Updated date -->
            <div class="px-2 flex items-center justify-end gap-2">
              <div class="flex items-center justify-end">
                <h3 class="text-[0.6rem] font-regular text-[var(--text-terceary)]">
                  Last modification:
                </h3>
              </div>
              <p class="text-[0.6rem] font-light text-[var(--text)]">
                {{
                  folderDetails?.updated
                    ? moment(folderDetails.updated * 1000).format('DD/MM/YYYY')
                    : '-'
                }}
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 px-5 pb-1 mt-4 w-full sm:px-12">
        <input
          v-if="editingFolderId === folderDetails.id"
          v-model="editedFolderName"
          @keyup.enter="saveFolderName(folderDetails)"
          @blur="editingFolderId = null"
          :data-folder-id="folderDetails.id"
          class="
            font-semibold text-2xl
            text-[var(--text)]
            bg-transparent
            border-b border-[var(--color-primary)]
            outline-none
          "
        />
        <h2
          v-else
          class="
            font-semibold text-[var(--text)]
            text-2xl
            break-words
          "
        >
        {{ folderDetails.name }}
        </h2>

        <button
          @click="startEditingFolder(folderDetails)"
          class="
            p-1 mt-1.5
            border border-transparent
            rounded-xl
            grayscale

            hover:border-[var(--color-primary)]
            hover:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img
            src="/icon/icon-edit.svg"
            alt="edit"
            class="cursor-pointer h-5"
          />
        </button>
      </div>
      <router-view></router-view>
    </div>
  </div>

  <Modal v-model="createFolderModal" size="xs">
    <template #header>
      New folder
    </template>
    <template #content>
      <div class="my-4">
        <form @submit.prevent="createFolder" id="create-folder-form">
          <label for="folder-name"></label>
          <img
            src="/icon/icon-folder.svg"
            alt="icon"
            class="h-5 mt-[1px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="folderName"
            type="text"
            placeholder="Folder name"
            id="folder-name"
            class="
              w-full border
              border-[var(--border)] bg-[var(--bg)]
              text-sm text-[var(--text)]
              my-2 pl-8 py-1
              rounded-full

              placeholder:text-[var(--text-terceary)]
              placeholder:font-light
              placeholder:text-sm

              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

              focus:border-[var(--color-primary)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300 ease-in-out
            "
            name="folder-name"
          />
        </form>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="createFolderModal = false"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full
          px-3

          hover:border-[var(--text)]
          hover:bg-[var(--hover-bg-gray)]
          hover:text-[var(--text)]
        ">
        Cancel
      </button>
      <button
        type="submit"
        form="create-folder-form"
        :disabled="!folderName || !folderName.trim()"
        class="
          text-[var(--text)] text-sm
          border
          rounded-full
          px-3
          transition
        "
        :class="!folderName || !folderName.trim()
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
      >
        Create
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FileI } from '@/store/files/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const store = useStore();
const route = useRoute();

const loading = ref(false);
const dropdownPosition = ref('top-8');
const activeDropdownToggle = ref<(() => void) | null>(null);
const createFolderModal = ref(false);
const folderName = ref('');
const editingFolderId = ref<number | string | null>(null);
const editedFolderName = ref('');
const showFab = ref(true); // Show FAB on mobile
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const showSidebar = computed(() => showSidebarState.value);
const hideBar = computed(() => route.path.includes('/details'));

const folderDetails = computed<FolderI>(() => store.state.folders.folder);
const folderId = computed<number>(() => Number(route.params.id as string));
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);

let lastScroll = 0;
let scrollTarget: Window | Element = window;

// Show FAB on mobile
const handleScroll = () => {
  const current = scrollTarget === window ? window.scrollY : (scrollTarget as Element).scrollTop;
  const threshold = 10;
  const offset = 50;

  if (current <= offset) {
    showFab.value = true;
  } else if (current > lastScroll + threshold) {
    showFab.value = false;
  } else if (current < lastScroll - threshold) {
    showFab.value = true;
  }

  lastScroll = current;
};

// toggle dropdown position based on click position
const toggleDropdown = async (toggle: () => void, event?: MouseEvent) => {
  if (event) event.stopPropagation();

  activeDropdownToggle.value = toggle;

  toggle();

  await nextTick();

  const middle = window.innerHeight / 2;
  const y = event?.clientY || 0;

  dropdownPosition.value = y > middle ? 'bottom-8' : 'top-8';
};

async function getFolders() {
  loading.value = true;
  try {
    // Load all folders - filtering by folderId is done client-side
    await store.dispatch('folders/filter', {
      query: '',
      page: 1,
      folderId: folderId.value,
    });
  } catch (error) {
    console.error('Error loading folders:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener las carpetas',
    });
  } finally {
    loading.value = false;
  }
}

async function getFolderDetails() {
  loading.value = true;
  console.log('folderId', folderId.value);
  try {
    await store.dispatch('folders/getFolderDetails', {
      folderId: Number(folderId.value),
    });
  } catch (error) {
    console.error('Error loading folder details:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los detalles de la carpeta',
    });
  } finally {
    loading.value = false;
  }
}

async function createFolder() {
  // test folder name
  if (!folderName.value) {
    store.commit('notifications/addNotification', {
      message: 'Folder name is required',
      type: 'error',
    });
    return;
  }
  // strip folder name
  const strippedFolderName = folderName.value.trim();
  loading.value = true;
  try {
    await store.dispatch('folders/createFolder', {
      name: strippedFolderName,
      folderId: folderId.value,
    });

    createFolderModal.value = false;
    folderName.value = '';

    await getFolderDetails();
    // await getFolders();
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al crear la carpeta';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

// rename folder
async function startEditingFolder() {
  if (!folderDetails.value) return;

  editingFolderId.value = folderDetails.value.id;
  editedFolderName.value = folderDetails.value.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-folder-id="${folderDetails.value.id}"]`,
  ) as HTMLInputElement | null;

  input?.focus();
  input?.select();
}

async function saveFolderName() {
  if (!folderDetails.value) return;

  const finalName = editedFolderName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('folders/changeFolderName', {
      id: folderDetails.value.id,
      name: finalName,
    });

    folderDetails.value.name = finalName;

    await getFolders();

    await nextTick();

    const updatedFolder = folderResults.value.data.find(
      (f: FolderI) => f.id === folderDetails.value.id,
    );

    if (updatedFolder) {
      store.commit('folders/setSelectedFolders', [updatedFolder]);
    }
  } catch (error) {
    console.error(error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al cambiar el nombre de la carpeta',
    });
  } finally {
    editingFolderId.value = null;
  }
}

onMounted(() => {
  getFolderDetails();
});

watch(() => route.params.id, () => {
  console.log('route.params.id', route.params.id);
  getFolderDetails();
}, { immediate: true });

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
