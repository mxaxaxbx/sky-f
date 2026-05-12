<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] h-screen overflow-hidden bg-black/80 backdrop-blur-sm">
        <section
          class="
            relative
            flex h-full w-full flex-col
            overflow-hidden
            text-left
          "
        >
          <div class="absolute right-0 top-0 w-full flex items-center justify-between p-2 bg-gradient-to-b from-[var(--bg)] to-transparent">
            <h3 class="text-lg font-semibold text-[var(--text)] pb-1">
              Scan document
            </h3>
            <button
              type="button"
              @click="closeModal"
              class="
                px-1 py-0.5
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                bg-transparent
                hover:text-[var(--color-primary)]
                hover:bg-[var(--hover-bg)]
                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

                transition-all duration-300
              "
            >
              <i class="fa-solid fa-xmark m-1"></i>
            </button>
          </div>

          <div class="flex min-h-0 flex-1 flex-col text-[var(--text-terceary)] text-sm">
            <div class="flex min-h-0 flex-1 flex-col gap-3 p-1 sm:p-4">
        <!-- Start button, always visible initially -->
        <!-- <div v-show="!cameraActive" class="text-center">
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
        </div> -->

        <!-- Video and controls, always in DOM but shown when camera active -->
        <div v-show="cameraActive" class="flex flex-1 flex-col gap-3 w-full h-full">
          <video
            ref="videoElement"
            autoplay
            muted
            playsinline
            class="min-h-0 flex-1 w-full rounded-xl bg-black object-cover"
          >
            <track kind="captions" />
          </video>
          <div class="grid grid-cols-2 gap-2 shrink-0">
            <button
              type="button"
              @click="captureFrame"
              class="
                bg-[var(--color-primary)] text-white text-sm font-medium
                border border-[var(--color-primary)]
                rounded-full px-2 py-1
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
                bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium
                border border-[var(--border)]
                rounded-full px-2 py-1
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
        <div v-if="capturedFrames.length > 0" class="shrink-0 border-t border-[var(--border)] pt-3">
          <p class="text-sm text-[var(--text-secondary)] mb-2">Captured frames: {{ capturedFrames.length }}</p>
          <div class="flex gap-2 flex-wrap mb-1 max-h-24 overflow-y-auto">
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
          </div>

          <div class="shrink-0 flex justify-end space-x-2 border-t border-[var(--border)] px-4 py-3">
            <button
              type="button"
              @click="closeModal"
              class="
                text-[var(--text-secondary)] text-sm
                border border-[var(--border)] bg-[var(--bg)]
                rounded-full
                px-3

                hover:border-[var(--text)]
                hover:bg-[var(--hover-bg-gray)]
                hover:text-[var(--text)]
              "
            >
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
          </div>
        </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  nextTick,
  onBeforeUnmount,
  onMounted,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  modelValue: Boolean,
  currentFolderId: {
    type: [Number, String, null] as any,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const store = useStore();
const cameraActive = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const capturedFrames = ref<string[]>([]);
const mediaStream = ref<MediaStream | null>(null);
const loading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  cameraActive.value = false;
}

function closeModal() {
  isOpen.value = false;
  stopCamera();
  capturedFrames.value = [];
}

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
    const images = await Promise.all(capturedFrames.value.map((frameData) => loadImage(frameData)));

    // Add each capture sequentially so every frame lands in the same PDF.
    images.forEach((img, i) => {
      if (i > 0) {
        pdf.addPage();
      }

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
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scan-${timestamp}.pdf`;

    // Convert PDF to Blob and upload
    const pdfBlob = pdf.output('blob') as Blob;
    const file = new File([pdfBlob], filename, { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', file);

    await store.dispatch('files/upload', { formData, folderId: props.currentFolderId });

    store.commit('notifications/addNotification', {
      message: 'PDF scanned and saved successfully',
      type: 'success',
    });

    closeModal();
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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal();
    e.stopImmediatePropagation();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, true);
});

onBeforeUnmount(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }

  window.removeEventListener('keydown', handleKeydown, true);
});

// Auto-start camera when modal opens
watch(
  () => isOpen.value,
  async (newValue) => {
    if (newValue) {
      await nextTick();
      await nextTick();
      await startCamera();
    } else {
      stopCamera();
    }
  },
);
</script>
