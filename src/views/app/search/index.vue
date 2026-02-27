<template>
  <div class="mt-10 pt-10 mx-2 sm:mx-14">
    <h1 class="text-xl mt-8 sm:mt-0 font-semibold font-alexandria mb-4 text-[var(--text)] hidden sm:block">
      Search Results for:
      <span v-if="searchQuery" class="text-xl font-light ml-1 text-[var(--text-terceary)]">
        "{{ searchQuery }}"
      </span>
    </h1>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-[var(--text)]"></i>
    </div>

    <!-- if no results -->
    <div v-else-if="!folders.length && !files.length" class="flex flex-col justify-center items-center py-20">
      <i class="fas fa-search text-4xl text-[var(--text-terceary)] mb-4"></i>
      <p class="text-[var(--text-terceary)] text-lg">No results found</p>
      <p class="text-[var(--text-terceary)] text-sm mt-2" v-if="searchQuery">
        Try searching with different keywords
      </p>
    </div>

    <!-- results -->
    <div v-else>
      <!-- folders -->
      <div v-if="folders.length" class="w-full my-4 px-4">
        <h3 class="font-semibold text-xs sm:text-sm truncate text-left mb-2 text-[var(--text)]">
          Folders ({{ folders.length }})
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="
              w-64
              border border-[var(--border)]
              rounded-2xl p-2
              flex items-center justify-between
              hover:border-[var(--color-primary)]
              transition-colors duration-300
            "
          >
            <router-link
              :to="`/app/folders/${folder.id}`"
              class="
                flex items-center
                space-x-2
                min-w-0 w-full overflow-hidden
              "
            >
              <i class="fas fa-folder text-[var(--color-primary)] text-xl"></i>
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-xs sm:text-sm truncate text-left text-[var(--text)]">
                  {{ folder.name }}
                </h3>
                <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                  {{ moment(folder.created * 1000).format('DD/MM/YY HH:mm') }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- files -->
      <div v-if="files.length" class="w-full my-4 mx-2">
        <h3
          class="
            flex items-center
            font-regular text-left text-md text-[var(--text-terceary)] truncate
            gap-2

            sm:mb-2 sm:font-semibold
          "
        >
          Files ({{ files.length }})
        </h3>
        <div class="
          grid grid-cols-1 gap-2 mx-0
          text-[var(--text)]
          sm:grid-cols-2 sm:gap-4
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        ">
          <div
            v-for="file in files"
            :key="file.id"
            class="
            group
            flex items-center justify-between
            w-full
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            rounded-2xl min-w-0
            cursor-move
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--hover-border)]
            hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
            transition-colors duration-300
          "
          :class="[
            'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
            isSelected(file) ?
              'border-[var(--color-primary)] bg-[var(--hover-bg)]' :
              'border-[var(--border)]'
          ]"
        >
          <div class="flex w-full h-auto items-center justify-between relative">
            <div class="flex-1 min-w-0">
              <div class="flex items center justify-between p-1">
                <div
                  class="
                    flex items-center
                    space-x-2
                    min-w-0 w-full overflow-hidden
                  "
                >
                  <!-- icons -->
                  <img
                    v-if="file.contentType === 'application/pdf'"
                    src="/icon/icon-pdf.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="
                      file.contentType === 'application/msword' ||
                      file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    "
                    src="/icon/icon-doc.svg"
                    alt="Word file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="
                      file.contentType === 'application/vnd.ms-excel' ||
                      file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    "
                    src="/icon/icon-excel.svg"
                    alt="Word file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="
                      file.contentType === 'application/vnd.ms-powerpoint' ||
                      file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    "
                    src="/icon/icon-ppt.svg"
                    alt="PowerPoint file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)"
                    src="/icon/icon-png.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="file.contentType === 'image/svg+xml'"
                    src="/icon/icon-svg.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)"
                    src="/icon/icon-img.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="/^video\//.test(file.contentType)"
                    src="/icon/icon-video.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="file.contentType === 'application/zip'"
                    src="/icon/icon-zip.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else-if="/^audio\//.test(file.contentType)"
                    src="/icon/icon-audio.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <img
                    v-else
                    src="/icon/icon-file.svg"
                    alt="image file icon"
                    class="h-10 w-10"
                  />
                  <!-- title and date -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate text-left">
                      {{ file.name }}
                    </h3>
                    <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                      {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} - {{ formatFileSize(file.size) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- options -->
            <div
              class="
                flex items-center justify-center
                border-l border-[var(--border)]
                w-6 py-1

                group-hover:border-[var(--color-primary)]
                transition-colors duration-300
              "
            >
              <Dropdown
                :classes="[
                  'bg-[var(--bg-secondary)]',
                  'border border-[var(--border)]',
                  'rounded-2xl',
                  'absolute','-right-0', 'z-20',
                  dropdownPosition,
                  'w-48',
                  'sm:-right-2'
                ]"
              >
                <template #trigger="{ toggle }">
                  <button
                    @click="toggleDropdown(toggle, $event)"
                    class="
                      text-[var(--text-terceary)]
                      w-6 h-10

                      hover:text-[var(--text)]
                      transition-colors duration-300
                    "
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </template>

                <template #content="{ }">
                  <div class="flex flex-col gap-0.5 px-1 py-1 font-regular text-sm text-[#868686]">

                    <!-- info file -->
                    <router-link
                      :to="`/app/files/details/${file.id}`"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon_details.svg" alt="download" class="h-5 mr-4"
                      />
                      <span>info</span>
                    </router-link>

                    <!-- preview file -->
                    <router-link
                      :to="`/app/files/details/${file.id}`"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon-preview.svg" alt="preview" class="h-5 mr-4"/>
                      <span>Preview</span>
                    </router-link>

                    <!--move to folder-->
                    <button
                      v-if="selectedFiles.length > 0"
                      type="button"
                      @click="moveToFolderModal = true"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon_move.svg" alt="move" class="h-5 mr-4"/>
                      <span>Move to folder</span>
                    </button>

                    <Modal v-model="moveToFolderModal" size="xl">
                      <template #header>
                        <!-- <div class="border-b border-[var(--border)] w-full px-6 pb-4"> -->
                        <h3 class="text-lg font-light">Move:
                        <span class="text-lg font-light">"{{ file.name }}"</span>
                        </h3>
                        <!-- </div> -->
                      </template>

                      <template #content>
                        <form @submit.prevent="moveToFolder" id="move-to-folder-form" class="my-2">
                          <div
                            class="
                              grid grid-cols-2 md:grid-cols-3 gap-2
                              ">

                          <button
                            v-for="folder in folderResults.data"
                            :key="folder.id"
                            type="button"
                            @click="selectedFolder = folder.id"
                            class="
                              flex items-center justify-start
                              px-2 py-0.5 gap-1.5
                              rounded-xl
                              border border-transparent
                              text-[var(--text-terceary)]
                              hover:bg-[var(--hover-bg)]
                              hover:border-[var(--color-primary)]
                              hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.3)]
                              hover:text-[var(--text)]
                              transition
                            "
                            :class="selectedFolder === folder.id ? 'bg-[var(--hover-bg)] border-[var(--color-primary)]' : ''"
                          >
                            <img src="/icon/icon-folder.svg" alt="folder" class="h-4.5"/>
                            <span class="text-sm text-left truncate w-full">
                              {{ folder.name }}
                            </span>
                          </button>

                          </div>
                        </form>
                      </template>

                      <template #footer>
                        <button
                          type="button"
                          @click="moveToFolderModal = false; selectedFolder = null;"
                          class="
                            text-[var(--text-secondary)] text-sm
                            border border-[var(--border)] bg-[var(--bg)]
                            rounded-full
                            px-3
                          ">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          form="move-to-folder-form"
                          class="
                            text-[var(--text)] text-sm
                            border
                            rounded-full
                            px-3
                            transition
                          "
                          :class="!selectedFolder
                            ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
                            : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
                        >
                          Move
                        </button>
                      </template>
                    </Modal>

                    <!--share link-->
                    <button
                      @click="copyLink(file)"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent

                        hover:bg-[var(--hover-bg)]
                        hover:border-[var(--color-primary)]
                        transition-all duration-300
                      "
                    >
                      <img src="/icon/icon-link.svg" alt="link" class="h-5 mr-4"
                      />
                      {{ copied ? 'Copied!' : 'Copy link' }}
                    </button>

                    <!-- download -->
                    <button
                      @click="downloadFile(file)"
                      class="
                        flex items-center justify-start
                        rounded-xl px-2 py-1 border border-transparent
                        grayscale

                        hover:bg-[var(--hover-bg)]
                        hover:text-[var(--color-primary)]
                        hover:border-[var(--color-primary)]
                        hover:grayscale-0
                        transition-colors duration-300
                      "
                    >
                      <img src="/icon/icon_download_2.svg" alt="download" class="h-5 mr-4"
                      />
                      <span>Download</span>
                    </button>
                  </div>
                </template>
              </Dropdown>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  nextTick,
  watch,
  defineAsyncComponent,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import moment from 'moment';

import { SearchResultI, FileI } from '@/store/files/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const store = useStore();
const route = useRoute();

const searchResult = computed<SearchResultI>(() => store.state.files.searchResult);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);

const loading = ref(false);
const dropdownPosition = ref('top-8');
const moveToFolderModal = ref(false);
const selectedFolder = ref<number | string | null>(null);
const isSelected = (file: FileI) => selectedFiles.value.some((f: FileI) => f.id === file.id);

const searchQuery = computed(() => (
  typeof route.query.q === 'string' ? route.query.q : ''
));

// Separate folders and files
const folders = computed(() => (
  searchResult.value.data.filter((item) => item.itemType === 'folder')
));

const files = computed(() => (
  searchResult.value.data.filter((item) => item.itemType === 'file')
));

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

async function getSearchResult() {
  const q = typeof route.query.q === 'string' ? route.query.q : '';
  if (!q) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    await store.dispatch('files/search', {
      q,
      page: 1,
    });
  } finally {
    loading.value = false;
  }
}

async function handleSelectFolder(ev: Event) {
  const target = ev.target as HTMLSelectElement;
  selectedFolder.value = target.value;
}

async function moveToFolder() {
  if (!selectedFolder.value) {
    return;
  }

  try {
    loading.value = true;
    await store.dispatch('files/moveFilesToFolder', selectedFiles.value);
    moveToFolderModal.value = false;
    selectedFolder.value = null;

    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      orderBy: 'created',
      order: 'desc',
      folderId: '',
    });
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al mover los archivos';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    loading.value = false;
  }
}

// toggle dropdown position based on click position
const toggleDropdown = async (toggle: () => void) => {
  toggle();

  await nextTick();

  const middle = window.innerHeight / 2;
  const y = window.event?.clientY || 0;

  if (y > middle) {
    dropdownPosition.value = 'bottom-8';
  } else {
    dropdownPosition.value = 'top-8';
  }
};

// Watch for route query changes
watch(() => route.query.q, () => {
  getSearchResult();
});

onMounted(() => {
  getSearchResult();
});
</script>
