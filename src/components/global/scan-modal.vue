<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] bg-black" style="height: 100dvh;">

      <!-- ═══════════════════════════════════════
           CAMERA VIEW
      ════════════════════════════════════════ -->
      <div v-show="!showPreview" class="relative flex flex-col" style="height: 100dvh;">

        <!-- Full-screen video -->
        <video
          ref="videoElement"
          autoplay
          muted
          playsinline
          class="absolute inset-0 h-full w-full object-cover"
          style="transform: translateZ(0);"
        >
          <track kind="captions" />
        </video>

        <!-- ── Top bar ── -->
        <div class="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
          <button type="button" @click="closeModal" class="text-white text-base font-medium drop-shadow">
            Cancelar
          </button>
          <button type="button" @click="toggleFlash" class="text-white text-base font-medium drop-shadow">
            {{ flashOn ? 'Flash: On' : 'Automático' }}
          </button>
        </div>

        <!-- ── Document guide overlay ── -->
        <div class="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40"></div>
          <div
            class="relative"
            :style="{
              width: guideW + 'px',
              height: guideH + 'px',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
              border: '2.5px solid rgba(255,255,255,0.85)',
              borderRadius: '6px',
            }"
          >
            <!-- Corner accents -->
            <span v-for="c in corners" :key="c" class="absolute border-white" :style="cornerStyle(c)"></span>
          </div>
        </div>

        <!-- Hint text below guide box -->
        <div class="absolute z-10 left-0 right-0 flex justify-center"
          :style="{ top: (guideOffsetTop + guideH + 18) + 'px' }">
          <p class="text-white/75 text-sm text-center px-6 drop-shadow">
            Encuadra el documento dentro del marco
          </p>
        </div>

        <!-- ── Bottom controls ── -->
        <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-8 pb-10">

          <!-- Gallery thumbnail -->
          <button
            type="button"
            @click="openGallery"
            class="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/60 bg-white/10 flex items-center justify-center"
          >
            <img
              v-if="capturedFrames.length > 0"
              :src="capturedFrames[capturedFrames.length - 1]"
              class="w-full h-full object-cover"
              alt="última captura"
            />
            <svg v-else class="w-7 h-7 text-white/40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </button>

          <!-- Shutter button -->
          <button
            type="button"
            @click="captureFrame"
            class="relative flex items-center justify-center"
            style="width: 76px; height: 76px;"
          >
            <span class="absolute inset-0 rounded-full border-4 border-white opacity-90"></span>
            <span class="rounded-full bg-white" style="width: 60px; height: 60px; display:block;"></span>
          </button>

          <!-- Pages count / empty slot -->
          <button
            type="button"
            @click="capturedFrames.length > 0 ? (showPreview = true) : null"
            class="w-14 h-14 flex flex-col items-center justify-center"
          >
            <span v-if="capturedFrames.length > 0"
              class="text-white text-xs font-semibold bg-white/20 rounded-full px-3 py-1 border border-white/40 whitespace-nowrap">
              {{ capturedFrames.length }} pág{{ capturedFrames.length !== 1 ? 's' : '' }}
            </span>
            <span v-else class="w-10 h-10 flex items-center justify-center">
              <svg class="w-7 h-7 text-white/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════
           PREVIEW / REVIEW VIEW
      ════════════════════════════════════════ -->
      <div v-if="showPreview" class="flex flex-col bg-[#111]" style="height: 100dvh;">

        <!-- Top bar -->
        <div class="flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/10">
          <button type="button" @click="showPreview = false" class="text-white text-base font-medium">
            ‹ Cámara
          </button>
          <h2 class="text-white font-semibold text-base">
            {{ capturedFrames.length }} página{{ capturedFrames.length !== 1 ? 's' : '' }}
          </h2>
          <button
            type="button"
            @click="saveScanAsPdf"
            :disabled="loading"
            class="font-semibold text-base"
            :class="loading ? 'text-white/40' : 'text-[#0a77f3]'"
          >
            {{ loading ? 'Guardando…' : 'Guardar PDF' }}
          </button>
        </div>

        <!-- Thumbnails list -->
        <div class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <div
            v-for="(frame, index) in capturedFrames"
            :key="index"
            class="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg"
          >
            <img :src="frame" :alt="`Página ${index + 1}`" class="w-full object-contain bg-black" />
            <div class="absolute top-3 left-3 bg-black/60 rounded-full px-2.5 py-0.5 text-white text-xs font-medium">
              {{ index + 1 }}
            </div>
            <button
              type="button"
              @click="removeFrame(index)"
              class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-white text-sm leading-none"
            >✕</button>
          </div>
        </div>

        <!-- Add more -->
        <div class="px-6 pb-10 pt-3 border-t border-white/10">
          <button
            type="button"
            @click="showPreview = false"
            class="w-full py-3 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/5 transition"
          >
            + Agregar más páginas
          </button>
        </div>
      </div>

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

// ── state ──
const videoElement = ref<HTMLVideoElement | null>(null);
const capturedFrames = ref<string[]>([]);
const mediaStream = ref<MediaStream | null>(null);
const loading = ref(false);
const cameraActive = ref(false);
const showPreview = ref(false);
const flashOn = ref(false);

// ── guide box (A4 ratio) ──
const guideW = ref(300);
const guideH = ref(420);
const guideOffsetTop = ref(0);

function recalcGuide() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let w = Math.round(vw * 0.82);
  let h = Math.round(w * 1.414);
  if (h > vh * 0.60) {
    h = Math.round(vh * 0.60);
    w = Math.round(h / 1.414);
  }
  guideW.value = w;
  guideH.value = h;
  guideOffsetTop.value = Math.round((vh - h) / 2);
}

// ── corners ──
const corners = ['tl', 'tr', 'bl', 'br'] as const;
function cornerStyle(c: string): Record<string, string> {
  const s = '22px';
  const t = '3px';
  const base: Record<string, string> = {
    position: 'absolute',
    display: 'block',
    width: s,
    height: s,
  };
  if (c === 'tl') {
    return {
      ...base,
      top: '-2px',
      left: '-2px',
      borderTop: `${t} solid white`,
      borderLeft: `${t} solid white`,
      borderTopLeftRadius: '4px',
    };
  }
  if (c === 'tr') {
    return {
      ...base,
      top: '-2px',
      right: '-2px',
      borderTop: `${t} solid white`,
      borderRight: `${t} solid white`,
      borderTopRightRadius: '4px',
    };
  }
  if (c === 'bl') {
    return {
      ...base,
      bottom: '-2px',
      left: '-2px',
      borderBottom: `${t} solid white`,
      borderLeft: `${t} solid white`,
      borderBottomLeftRadius: '4px',
    };
  }
  return {
    ...base,
    bottom: '-2px',
    right: '-2px',
    borderBottom: `${t} solid white`,
    borderRight: `${t} solid white`,
    borderBottomRightRadius: '4px',
  };
}

// ── isOpen ──
const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// ── camera ──
async function startCamera() {
  const constraints: MediaStreamConstraints = {
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    audio: false,
  };
  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (err) {
      console.error('Camera error:', err);
      store.commit('notifications/addNotification', { message: 'No se puede acceder a la cámara.', type: 'error' });
      return;
    }
  }
  await nextTick();
  if (videoElement.value && mediaStream.value) {
    videoElement.value.srcObject = mediaStream.value;
    try { await videoElement.value.play(); } catch { /* silent */ }
    cameraActive.value = true;
  }
}

function stopCamera() {
  mediaStream.value?.getTracks().forEach((t) => t.stop());
  mediaStream.value = null;
  cameraActive.value = false;
}

function toggleFlash() {
  flashOn.value = !flashOn.value;
  const track = mediaStream.value?.getVideoTracks()[0];
  if (track) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error torch is not in standard TS typings
      track.applyConstraints({ advanced: [{ torch: flashOn.value }] });
    } catch { /* device may not support torch */ }
  }
}

function openGallery() {
  if (capturedFrames.value.length > 0) showPreview.value = true;
}

// ── capture ──
function captureFrame() {
  if (!videoElement.value) return;
  const v = videoElement.value;
  const canvas = document.createElement('canvas');
  canvas.width = v.videoWidth || 1280;
  canvas.height = v.videoHeight || 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(v, 0, 0);
  capturedFrames.value.push(canvas.toDataURL('image/jpeg', 0.92));
  store.commit('notifications/addNotification', {
    message: `Página ${capturedFrames.value.length} capturada`,
    type: 'success',
  });
}

function removeFrame(index: number) {
  capturedFrames.value.splice(index, 1);
  if (capturedFrames.value.length === 0) showPreview.value = false;
}

// ── close ──
function closeModal() {
  isOpen.value = false;
  stopCamera();
  capturedFrames.value = [];
  showPreview.value = false;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) { closeModal(); e.stopImmediatePropagation(); }
}

// ── save PDF ──
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function saveScanAsPdf() {
  if (!capturedFrames.value.length) return;
  try {
    loading.value = true;
    const jsPDFModule = await import('jspdf');
    // handle both default and named exports
    const jsPDF = (jsPDFModule as any).jsPDF ?? (jsPDFModule as any).default?.jsPDF ?? (jsPDFModule as any).default;
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw: number = pdf.internal.pageSize.getWidth();
    const ph: number = pdf.internal.pageSize.getHeight();

    const images = await Promise.all(capturedFrames.value.map(loadImage));
    images.forEach((img, i) => {
      if (i > 0) pdf.addPage();
      let iw = pw - 20;
      let ih = (img.height * iw) / img.width;
      if (ih > ph - 20) {
        ih = ph - 20;
        iw = (img.width * ih) / img.height;
      }
      pdf.addImage(img.src, 'JPEG', (pw - iw) / 2, 10, iw, ih);
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scan-${timestamp}.pdf`;
    const blob = pdf.output('blob') as Blob;
    const file = new File([blob], filename, { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    await store.dispatch('files/upload', { formData, folderId: props.currentFolderId });
    store.commit('notifications/addNotification', { message: 'PDF guardado exitosamente', type: 'success' });
    closeModal();
  } catch (err) {
    console.error(err);
    store.commit('notifications/addNotification', { message: 'Error al guardar el PDF', type: 'error' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  recalcGuide();
  window.addEventListener('resize', recalcGuide);
  window.addEventListener('keydown', handleKeydown, true);
});

onBeforeUnmount(() => {
  stopCamera();
  window.removeEventListener('resize', recalcGuide);
  window.removeEventListener('keydown', handleKeydown, true);
});

// Auto-start camera when modal opens
watch(
  () => isOpen.value,
  async (v) => {
    if (v) {
      showPreview.value = false;
      await nextTick();
      await nextTick();
      await startCamera();
    } else {
      stopCamera();
    }
  },
);
</script>
