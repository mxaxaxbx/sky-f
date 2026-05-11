<template>
  <div
    class="
      flex flex-row items-start
      bg-[var(--bg)]
      pt-10
      h-screen
      font-alexandria font-sans
    "
  >
    <div
      class="
        flex flex-col items-start
        px-0  pt-0 w-full h-full
        sm:pt-6
      "
    >

      <!-- actions desktop-->
      <div class="flex items-center w-full gap-2 px-8">
        <label
          v-if="!hideBar"
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

        <button
          v-if="!hideBar"
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
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            focus:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-new-folder.svg" alt="icon" class="h-5 mr-2" />
          New folder
        </button>
        <button
          v-if="!hideBar"
          @click="createGroupModal = true"
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
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            focus:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-isle.svg" alt="icon" class="h-5 mr-2" />
          New group
        </button>
        <button
          v-if="!hideBar"
          @click="openScanModal"
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
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:border-[var(--hover-border)]
            focus:grayscale-0
            transition-all duration-300 ease-in-out
            cursor-pointer
          "
        >
          <img src="/icon/icon-upload.svg" alt="icon" class="h-5 mr-2" />
          Scan document
        </button>
      </div>

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
                  <!--scan document-->
                  <button
                    type="button"
                    @click="openScanModal"
                    class="
                      flex items-center justify-start
                      rounded-xl px-2 py-1 border border-transparent
                      grayscale

                      hover:bg-[var(--hover-bg)]
                      hover:grayscale-0
                      hover:border-[var(--color-primary)]
                      transition-colors duration-300"
                  >
                    <img src="/icon/icon-upload.svg" alt="scan" class="h-6 mr-4"/>
                    <span>Scan document</span>
                  </button>
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

  <Modal v-model="createGroupModal" size="xs">
    <template #header>
      New group
    </template>
    <template #content>
      <div class="my-4">
        <form @submit.prevent="createGroup" id="create-group-form">
          <label for="group-name"></label>
          <img
            src="/icon/icon-folder.svg"
            alt="icon"
            class="h-5 mt-[1px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="groupName"
            type="text"
            placeholder="Group name"
            id="group-name"
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
            name="group-name"
          />
        </form>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="createGroupModal = false"
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
        form="create-group-form"
        :disabled="!groupName || !groupName.trim()"
        class="
          text-[var(--text)] text-sm
          border
          rounded-full
          px-3
          transition
        "
        :class="!groupName || !groupName.trim()
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
      >
        Create
      </button>
    </template>
  </Modal>

  <Modal v-model="scanModal" size="sm">
    <template #header>
      Scan document
    </template>
    <template #content>
      <div class="my-4 flex flex-col gap-4">
        <div v-if="!cameraActive" class="text-center">
          <p class="text-[var(--text-secondary)] text-sm mb-4">
            Position your document in the camera frame and tap the button to capture
          </p>
          <button
            type="button"
            @click="startCamera"
            class="
              w-full bg-[var(--color-primary)] text-white text-sm font-medium
              border border-[var(--color-primary)]
              rounded-full px-4 py-2
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300
            "
          >
            Start Camera
          </button>
        </div>
        <div v-else class="flex flex-col gap-2">
          <video
            ref="videoElement"
            autoplay
            muted
            playsinline
            controls
            class="w-full h-64 rounded-lg bg-black"
          >
            <track kind="captions" />
          </video>
          <div class="flex gap-2">
            <button
              type="button"
              @click="captureFrame"
              class="
                flex-1 bg-[var(--color-primary)] text-white text-sm font-medium
                border border-[var(--color-primary)]
                rounded-full px-4 py-2
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300
              "
            >
              Capture
            </button>
            <button
              type="button"
              @click="stopCamera"
              class="
                flex-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium
                border border-[var(--border)]
                rounded-full px-4 py-2
                hover:bg-[var(--hover-bg)]
                transition-all duration-300
              "
            >
              Cancel
            </button>
          </div>
        </div>
        <canvas
          v-if="capturedFrames.length > 0"
          ref="previewCanvas"
          class="hidden"
        ></canvas>
        <div v-if="capturedFrames.length > 0" class="border-t border-[var(--border)] pt-3">
          <p class="text-sm text-[var(--text-secondary)] mb-2">Captured frames: {{ capturedFrames.length }}</p>
          <div class="flex gap-2 flex-wrap mb-3">
            <div
              v-for="(frame, index) in capturedFrames"
              :key="index"
              class="relative w-12 h-12 rounded border border-[var(--border)]"
            >
              <img :src="frame" :alt="`Frame ${index + 1}`" class="w-full h-full object-cover rounded" />
              <button
                type="button"
                @click="removeFrame(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        @click="closeScanModal"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full
          px-3

          hover:border-[var(--text)]
          hover:bg-[var(--hover-bg-gray)]
          hover:text-[var(--text)]
        ">
        Close
      </button>
      <button
        type="button"
        @click="saveScanAsPdf"
        :disabled="capturedFrames.length === 0 || loading"
        class="
          text-[var(--text)] text-sm
          border
          rounded-full
          px-3
          transition
        "
        :class="capturedFrames.length === 0 || loading
          ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
          : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
      >
        {{ loading ? 'Saving...' : 'Save as PDF' }}
      </button>
    </template>
  </Modal>

</template>

<script setup lang="ts">
import {
  ref,
  defineAsyncComponent,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import { FileI } from '@/store/files/state';
import { FoldersResultI } from '@/store/folders/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const route = useRoute();
const router = useRouter();
const store = useStore();

let searchTimeout: number | undefined;

const query = ref<string>('');
const loading = ref(false);

const showFab = ref(true); // Show FAB on mobile
const dropdownPosition = ref('top-8');
const activeDropdownToggle = ref<(() => void) | null>(null);
const createFolderModal = ref(false);
const folderName = ref('');
const createGroupModal = ref(false);
const groupName = ref('');
const moveToFolderModal = ref(false);
const scanModal = ref(false);
const cameraActive = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const capturedFrames = ref<string[]>([]);
const mediaStream = ref<MediaStream | null>(null);

const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const selectedFolder = ref<number | string | null>(null);
const progress = computed<number>(() => store.state.files.uploadProgress);
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const hideBar = computed(() => route.path.includes('/details'));
const showSidebar = computed(() => showSidebarState.value);

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

const toggleSidebar = () => {
  store.commit('toggleSidebar');
};

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
    await store.dispatch('folders/createFolder', { name: strippedFolderName, folderId: null });
    createFolderModal.value = false;
    folderName.value = '';
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

function createGroup() {
  const name = groupName.value.trim();
  if (!name) return;

  const saved = localStorage.getItem('folderGroups');
  let groups = saved ? JSON.parse(saved) : [];

  if (!Array.isArray(groups)) {
    groups = [];
  }

  const nextId = groups.length > 0 ? Math.max(...groups.map((g: any) => g.id)) + 1 : 1;

  groups.push({ id: nextId, name, folderIds: [] });
  localStorage.setItem('folderGroups', JSON.stringify(groups));
  window.dispatchEvent(new Event('folder-groups-updated'));

  createGroupModal.value = false;
  groupName.value = '';
}

async function handleSearch() {
  const payload = {
    page: 1,
    q: query.value,
  };

  await store.dispatch('files/filter', payload);
  router.replace({
    query: {
      ...payload,
    },
  });

  router.push({
    path: '/app/search',
    query: {
      ...payload,
    },
  });
}

async function handleInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500);
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

// Scanner functions
async function startCamera() {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.warn('Environment camera not available, falling back to default camera', error);
    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (fallbackError) {
      console.error('Error accessing camera:', fallbackError);
      store.commit('notifications/addNotification', {
        message: 'Unable to access camera. Please check permissions.',
        type: 'error',
      });
      return;
    }
  }

  await nextTick();

  if (videoElement.value && mediaStream.value) {
    videoElement.value.srcObject = mediaStream.value;
    videoElement.value.muted = true;
    videoElement.value.playsInline = true;
    videoElement.value.controls = true;

    const playVideo = async () => {
      try {
        await videoElement.value?.play();
      } catch (playError) {
        console.warn('Video play prevented:', playError);
      }
    };

    if (videoElement.value.readyState >= 2) {
      await playVideo();
    } else {
      await new Promise<void>((resolve) => {
        const handleLoaded = () => {
          videoElement.value?.removeEventListener('loadedmetadata', handleLoaded);
          playVideo().finally(resolve);
        };

        videoElement.value?.addEventListener('loadedmetadata', handleLoaded);
      });
    }

    cameraActive.value = true;
  }
}

async function openScanModal() {
  scanModal.value = true;
  await nextTick();
  await new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  activeDropdownToggle.value?.();
  await startCamera();
}

function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  cameraActive.value = false;
}

function closeScanModal() {
  scanModal.value = false;
  stopCamera();
  capturedFrames.value = [];
}

function captureFrame() {
  if (!videoElement.value) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.width = videoElement.value.videoWidth;
  canvas.height = videoElement.value.videoHeight;

  ctx.drawImage(videoElement.value, 0, 0);

  const frameData = canvas.toDataURL('image/jpeg', 0.8);
  capturedFrames.value.push(frameData);

  store.commit('notifications/addNotification', {
    message: `Frame captured (${capturedFrames.value.length})`,
    type: 'success',
  });
}

function removeFrame(index: number) {
  capturedFrames.value.splice(index, 1);
}

async function saveScanAsPdf() {
  if (capturedFrames.value.length === 0) return;

  try {
    loading.value = true;

    // Dynamically import jsPDF
    // eslint-disable-next-line import/no-extraneous-dependencies, new-cap
    const jsPDFModule = await import('jspdf');
    const { jsPDF } = jsPDFModule;

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    await Promise.all(
      capturedFrames.value.map(
        (frameData, i) => new Promise<void>((resolve) => {
          if (i > 0) {
            pdf.addPage();
          }

          const img = new Image();
          img.src = frameData;

          img.onload = () => {
            const imgWidth = pageWidth - 20;
            const imgHeight = (img.height * imgWidth) / img.width;

            if (imgHeight > pageHeight - 20) {
              const ratio = (pageHeight - 20) / imgHeight;
              pdf.addImage(
                img.src,
                'JPEG',
                10,
                10,
                imgWidth,
                imgHeight * ratio,
              );
            } else {
              pdf.addImage(
                img.src,
                'JPEG',
                10,
                10,
                imgWidth,
                imgHeight,
              );
            }
            resolve();
          };
        }),
      ),
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scan-${timestamp}.pdf`;

    pdf.save(filename);

    store.commit('notifications/addNotification', {
      message: 'PDF saved successfully',
      type: 'success',
    });

    closeScanModal();
  } catch (error) {
    console.error('Error saving PDF:', error);
    store.commit('notifications/addNotification', {
      message: 'Error saving PDF file',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  scrollTarget = document.querySelector('.overflow-auto, .overflow-y-auto') || window;

  lastScroll = scrollTarget === window ? window.scrollY : (scrollTarget as Element).scrollTop;

  scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  scrollTarget.removeEventListener('scroll', handleScroll);
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
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
