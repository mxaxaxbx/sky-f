<template>
  <!-- loading -->
  <div v-if="loading" class="flex justify-center items-center py-20">
    <i class="fas fa-spinner fa-spin text-2xl text-[var(--text)]"></i>
  </div>

  <!-- if not results -->
  <div v-if="!fileResults.data.length && !folderResults.data.length" class=" flex justify-center items-center py-20 w-full">
    <p class="text-[var(--text-terceary)]">No hay contenido en esta carpeta</p>
  </div>

  <!-- content -->
  <div v-else class="w-full mx-auto p-2 sm:p-4 w-full border border-[var(--border)] rounded-3xl">

    <!-- folders -->
    <div v-if="folderResults.data.length" class="w-full border-t border-[var(--border)] mt-20 py-0 px-2 sm:mt-0 sm:px-0">
      <h3
        class="
          font-regular text-sm text-[var(--text-terceary)]
          truncate text-left
          mb-1 px-3 gap-2
          sm:text-lg sm:mb-0 sm:font-semibold
          flex items-center
        "
      >
        <span>Folders</span>
        <button
          type="button"
          @click="showFolders = !showFolders"
          class="text-sm border border-transparent rounded-full
            hover:border-[var(--color-primary)]
            hover:bg-[var(--hover-bg)]
            hover:text-[var(--text)] h-6 w-6
            transition-all duration-300"
          :class="showFolders ? '-rotate-90 text-[var(--color-primary)]' : 'rotate-0'"
        >
          <i class="fa-solid fa-angles-down"></i>
        </button>
      </h3>
      <Transition name="accordion">
        <div
          v-show="showFolders"
          class="
            grid grid-cols-1 gap-2 mx-0
            text-[var(--text)] my-4

            sm:grid-cols-2 sm:gap-4 sm:mx-4 sm:my-4
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
          "
        >
          <div
            v-for="folder in folderResults.data"
            :key="folder.id"
            class="
                group
                flex items-center justify-between
                w-full
                bg-[var(--bg-secondary)]
                border border-[var(--border)]
                rounded-2xl min-w-0

                hover:bg-[var(--hover-bg)]
                hover:border-[var(--hover-border)]
                hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
                transition-colors duration-300
              "
          >
            <router-link
              :to="`/app/folders/${folder.id}`"
              class="flex-1 min-w-0"
            >
              <div class="flex items center justify-between p-1">
                <div
                    class="
                      flex items-center
                      space-x-2
                      min-w-0 w-full overflow-hidden
                    "
                  >
                  <img src="/icon/icon-folder.svg" alt="folder" class="h-8"/>

                  <!-- title and date -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
                      {{ folder.name }}
                    </h3>
                  </div>
                </div>
              </div>
            </router-link>
            <div
              class="
                flex items-center justify-center
                border-l border-[var(--border)]
                w-6 py-2

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
                      @click="toggleDropdown(toggle)"
                      class="
                        text-[var(--text-terceary)]
                        w-6 h-auto

                        hover:text-[var(--text)]
                        transition-colors duration-300
                      "
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </template>

                  <template #content="{ }">
                    <div class="flex flex-col gap-0.5 px-1 py-1 font-light text-sm text-[#868686]">
                      <router-link
                        :to="`/app/folders/details/${folder.id}`"
                        class="
                          flex items-center justify-start
                          rounded-xl px-2 py-1 border border-transparent

                          hover:bg-[var(--hover-bg)]
                          hover:border-[var(--color-primary)]
                          transition-colors duration-300
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
      </Transition>
    </div>

    <!-- files -->
    <div v-if="fileResults.data.length" class="w-full">
      <!-- <h3
        class="
          font-regular text-sm text-[var(--text-terceary)]
          truncate text-left
          mb-1 px-3

          sm:text-lg sm:mb-4 sm:font-semibold
        "
      >Files</h3> -->
      <div
        class="
          grid grid-cols-1 gap-2 mx-0
          text-[var(--text)]

          sm:grid-cols-2 sm:gap-4 sm:mx-0
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
      >
        <div
          v-for="file in fileResults.data"
          :key="file.id"
          class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0

              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
              transition-colors duration-300
            "
        >
          <div class="flex w-full h-auto items-center justify-between relative">
            <router-link
              :to="`/app/files/details/${file.id}`"
              class="flex-1 min-w-0"
            >
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
            </router-link>
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
                    @click="toggleDropdown(toggle)"
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
                  <div class="flex flex-col gap-0.5 px-1 py-1 font-light text-sm text-[#868686]">

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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FilesResultI } from '@/store/files/state';

const store = useStore();

const loading = ref(false);

const trashFolder = computed<FolderI>(() => store.state.folders.trashFolder);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const fileResults = computed<FilesResultI>(() => store.state.files.result);

async function getTrashFolder() {
  loading.value = true;
  try {
    await store.dispatch('folders/getTrashFolder');
  } catch (error) {
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener la papelera',
    });
  } finally {
    loading.value = false;
  }
}

async function getFolders() {
  loading.value = true;
  try {
    // Load all folders - filtering by folderId is done client-side
    await store.dispatch('folders/filter', {
      query: '',
      page: 1,
      folderId: trashFolder.value.id,
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

async function getFiles() {
  loading.value = true;
  try {
    // Load all files - filtering by folderId is done client-side
    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      folderId: trashFolder.value.id,
    });
  } catch (error) {
    console.error('Error loading files:', error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los archivos',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getTrashFolder();
  await getFolders();
  await getFiles();
});
</script>
