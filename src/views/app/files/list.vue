<template>
  <div>
    <!-- list -->
    <div class="w-full pb-4 pt-0 px-0 mt-20 sm:mt-0 sm:pt-2 sm:px-3">
      <h1 class="text-lg mt-8 sm:mt-0 font-semibold mb-4 ml-2 text-[var(--text)] hidden sm:block">Could Drive</h1>

      <!-- loading -->
      <div v-if="loading" class="flex justify-center items-center">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
      <!-- if not results -->
      <div v-else-if="!results.data.length" class="flex justify-center items-center">
        <p class="text-gray-500">No hay resultados</p>
      </div>
      <!-- results -->
      <div
        class="
          grid grid-cols-1 gap-2
          text-[var(--text)]

          sm:grid-cols-2 sm:gap-4
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
      >
        <!-- results -->
        <div
          v-for="file in results.data"
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
          <router-link
            :to="`/app/files/details/${file.id}`"
            class="flex-1 min-w-0"
          >
            <div class="flex items center justify-between m-1">
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
                  <h3 class="font-semibold text-xs sm:text-sm truncate text-left">
                    {{ file.name }}
                  </h3>
                  <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                    {{ moment(file.created * 1000).format('DD/MM/YYYY HH:mm') }}
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
              h-full w-6

              group-hover:border-[var(--color-primary)]
              transition-colors duration-300
            "
          >
            <Dropdown :classes="['bg-[var(--bg-secondary)]','border border-[var(--border)]', 'rounded-2xl', 'absolute', 'z-10','-right-0','top-8','w-48', 'sm:-right-2']">
              <template #trigger="{ toggle }">
                <button
                  @click="toggle"
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
                  <!-- download -->
                  <button
                    @click="downloadFile(file)"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent

                      hover:bg-[var(--hover-bg)]
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300
                    "
                  >
                    <img src="/icon/icon_download_2.svg" alt="download" class="h-4 mr-3"
                    />
                    <span>Download</span>
                  </button>

                  <!--share link-->
                  <button
                    @click="copyLink"
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

                  <!-- details -->
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
                    <span>Details</span>
                  </router-link>
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
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FileI, FilesResultI } from '@/store/files/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const results = computed<FilesResultI>(() => store.state.files.result);

const loading = ref(false);
const copied = ref(false);

async function getMoreResults() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 10) {
    const { page } = results.value;
    const query = typeof route.query.query === 'string' ? route.query.query : '';

    const { totalPages } = results.value;
    console.log('Loading more results...', page, totalPages);

    if (loading.value) {
      return; // Prevent multiple simultaneous loads
    }

    if (page >= totalPages) {
      return; // No more pages to load
    }

    loading.value = true;

    await store.dispatch('files/filter', {
      page: page + 1,
      query,
    });

    loading.value = false;
  }
}

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

async function downloadFile(file: FileI) {
  await store.dispatch('files/downloadFile', file);
}

onMounted(() => {
  // when scrolling to bottom, load more results
  window.addEventListener('scroll', getMoreResults);
});

onUnmounted(() => {
  // TODO: validate pagination
  window.removeEventListener('scroll', getMoreResults);
});

</script>
