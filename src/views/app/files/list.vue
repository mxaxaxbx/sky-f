<template>
  <h1 class="text-lg mt-8 sm:mt-0 font-semibold mb-4 ml-2 text-[var(--text)] hidden sm:block">Could Drive</h1>

  <!-- loading -->
  <div v-if="loading" class="flex justify-center items-center">
    <i class="fas fa-spinner fa-spin text-2xl"></i>
  </div>

  <!-- if not results -->
  <div v-else-if="!fileResults.data.length && !folderResults.data.length" class="flex justify-center items-center">
    <p class="text-gray-500">No hay resultados</p>
  </div>

  <!-- folders -->
  <div class="w-full my-4">
    <h3 class="font-semibold text-xs sm:text-sm truncate text-left"> Folders </h3>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="folder in folderResults.data"
        :key="folder.id"
        class="
          w-64
          border border-[var(--border)]
          rounded-2xl p-2
          flex items-center justify-between
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
          <i class="fas fa-folder"></i>
          <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
            {{ folder.name }}
          </h3>
        </router-link>
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
              class="text-[var(--text-terceary)] w-6 h-10">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </template>
          <template #content="{ }">
            <div class="flex flex-col gap-0.5 px-1.5 py-1 font-light text-sm text-[#868686]">
              <router-link
                :to="`/app/folders/details/${folder.id}`"
                class="
                  flex items-center justify-start
                  rounded-xl
                  px-2 py-1
                  border border-transparent
                  hover:bg-[var(--hover-bg)] hover:border-[var(--color-primary)]
                  transition-colors duration-30
                "
              >
                <img src="/icon/icon_details.svg" alt="download" class="h-4 mr-3" />
                <span>info</span>
              </router-link>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
  </div>

  <!-- results -->
  <div class="w-full my-4">
    <h3 class="font-semibold text-xs sm:text-sm truncate text-left"> Files </h3>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="file in fileResults.data"
        :key="file.id"
        class="
          flex flex-wrap space-x-2
        "
      >
        <div
          class="
            w-64
            border border-[var(--border)]
            rounded-2xl
            flex items-center justify-between
          "
        >
          <router-link
            :to="`/app/files/details/${file.id}`"
            class="
              flex items-center
              space-x-2
              min-w-0 w-full overflow-hidden
            "
          >
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
              <div class="">
                <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
                  {{ file.name }}
                </h3>
                <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                  {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} - {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
          </router-link>
          <!-- options -->
          <div
            class="
              flex items-center justify-center
              border-l border-[var(--border)]
              h-full w-6

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
                <div class="flex flex-col gap-0.5 px-1.5 py-1 font-light text-sm text-[#868686]">

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
                    <img src="/icon/icon_details.svg" alt="download" class="h-4 mr-3"
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
                    <img src="/icon/icon-preview.svg" alt="preview" class="h-4 mr-3"
                    />
                    <span>Preview</span>
                  </router-link>

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
                    <img src="/icon/icon-link.svg" alt="download" class="h-4 mr-3"
                    />
                    {{ copied ? 'Copied!' : 'Copy link' }}
                  </button>

                  <!-- download -->
                  <button
                    @click="downloadFile(file)"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent
                      text-[var(--color-primary)]
                      grayscale

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      hover:grayscale-0
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon_download_2.svg" alt="download" class="h-4 mr-3"
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
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI, FilesResultI } from '@/store/files/state';
import { FolderI, FoldersResultI } from '@/store/folders/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();
const route = useRoute();

const fileResults = computed<FilesResultI>(() => store.state.files.result);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);

const loading = ref(false);
const copied = ref(false);
const dropdownPosition = ref('top-8');

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

// toggle dropdown position based on click position
const toggleDropdown = async (toggle) => {
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

// copy link to clipboard
const copyLink = async (file: FileI) => {
  const url = await store.dispatch('files/getDownloadUrl', file);
  await navigator.clipboard.writeText(url);

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

async function downloadFile(file: FileI) {
  await store.dispatch('files/downloadFile', file);
}

async function getFolders() {
  await store.dispatch('folders/filter', {
    query: '',
    page: 1,
  });
}

async function getFiles() {
  await store.dispatch('files/filter', {
    query: '',
    page: 1,
  });
}

onMounted(() => {
  getFolders();
  getFiles();
  // when scrolling to bottom, load more results
  // window.addEventListener('scroll', getMoreResults);
});

onUnmounted(() => {
  // TODO: validate pagination
  // window.removeEventListener('scroll', getMoreResults);
});

</script>
