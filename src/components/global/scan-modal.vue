<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] bg-black" style="height: 100dvh;">

      <!-- CAMERA VIEW -->
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

        <!-- Hidden canvas used for auto-detection analysis -->
        <canvas ref="analysisCanvas" class="hidden"></canvas>

        <!-- ── Top bar: Cancelar | Flash | Auto ── -->
        <div class="relative z-[99999] flex items-center justify-between px-4 py-2">
          <button type="button" @click="closeModal" class="text-white text-base font-regular drop-shadow text-left flex-1 justify-start items-center">
            Cancel
          </button>
          <div class="flex flex-col items-center flex-1">
            <span v-if="!cvLoaded" class="text-[10px] text-white/40">Loading AI...</span>
            <button
              v-else
              type="button"
              @click="capturedFrames.length > 0 ? (showPreview = true) : null"
              class="flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all"
              :class="capturedFrames.length > 0 ? '' : 'opacity-40 cursor-default'"
            >
              <span class="text-white font-bold text-sm leading-none">
                {{ capturedFrames.length }}
              </span>
              <span class="text-white/60 text-[10px] leading-none">
                {{ capturedFrames.length === 1 ? 'pag' : 'pages' }}
              </span>
            </button>
          </div>
          <!-- Auto mode toggle -->
          <div class="flex flex-1 justify-end items-center">
            <button
              type="button"
              @click="autoMode = !autoMode"
              class="flex items-center justify-center py-1 px-3 rounded-full border transition-all"
              :class="autoMode
                ? 'text-white border-[var(--color-primary)] bg-[var(--color-primary)]'
                : 'text-[#868686] border-[#868686] bg-black/30'"
            >
              <span class="text-sm font-semibold">Auto</span>
            </button>
          </div>
        </div>

        <!-- ── Document guide overlay ── -->
        <div class="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40"></div>

          <!-- Intelligent Detection Overlay -->
          <svg v-if="detectedQuadPoints.length === 4" class="absolute inset-0 w-full h-full z-20">
            <polygon
              :points="svgQuadPoints"
              fill="rgba(74, 222, 128, 0.25)"
              stroke="#4ade80"
              stroke-width="3"
              stroke-linejoin="round"
              class="transition-all duration-150"
            />
            <!-- Corner indices for debugging -->
            <g v-for="(p, i) in detectedQuadPoints" :key="i">
              <circle :cx="p.x" :cy="p.y" r="10" fill="rgba(0,0,0,0.5)" />
              <text :x="p.x" :y="p.y + 4" font-size="12" fill="white" text-anchor="middle">{{ i + 1 }}</text>
            </g>
          </svg>

          <!-- Diagnostic Info (Hidden by default, shown for troubleshooting) -->
          <div v-if="detectedQuadPoints.length === 4" class="absolute top-4 left-4 z-50 bg-black/60 p-2 rounded text-[10px] text-white font-mono pointer-events-none">
            Pts: 1:({{Math.round(detectedQuadPoints[0].x)}},{{Math.round(detectedQuadPoints[0].y)}})
            4:({{Math.round(detectedQuadPoints[3].x)}},{{Math.round(detectedQuadPoints[3].y)}})
          </div>

          <div
            v-else
            class="relative transition-all duration-300 mb-10"
            :style="{
              width: guideW + 'px',
              height: guideH + 'px',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
              border: documentDetected ? '2.5px solid #4ade80' : '1px solid white',
              borderRadius: '10px',
            }"          >
            <!-- Corner accents -->
            <span
              v-for="c in corners"
              :key="c"
              class="absolute transition-colors duration-300"
              :class="documentDetected ? 'border-green-400' : 'border-[#0A77F3]'"
              :style="cornerStyle(c)"
            ></span>
          </div>
        </div>

        <!-- Hint text below guide box -->
        <div
          class="absolute z-10 left-0 right-0 flex justify-center transition-all duration-300"
          :style="{ top: (guideOffsetTop + guideH ) + 'px' }"
        >
          <p
            class="text-sm text-center px-6 drop-shadow font-regular transition-colors duration-300"
            :class="documentDetected ? 'text-green-400' : 'text-white/75'"
          >
            {{ documentDetected ? 'Document detected…' : 'Align the document within the frame' }}
          </p>
        </div>

        <!-- Auto-capture countdown ring (shown when document detected) -->
        <div
          v-if="documentDetected && autoMode"
          class="absolute z-10 left-0 right-0 flex justify-center"
          :style="{ top: (guideOffsetTop + guideH + 38) + 'px' }"
        >
          <div class="flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1">
            <svg class="w-3 h-3 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-green-400 text-xs font-semibold">Capturando en {{ countdown }}s</span>
          </div>
        </div>

        <!-- Bottom controls -->
        <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-2">

          <!-- Gallery thumbnail (last capture, proportional) -->
          <div class="flex items-center justify-start flex-1">
            <button
              type="button"
              @click="openGallery"
              class="h-12 w-8 flex items-center justify-start overflow-hidden rounded-lg"
            >
              <img
                v-if="capturedFrames.length > 0"
                :src="capturedFrames[capturedFrames.length - 1]"
                alt="última captura"
              />
              <svg v-else class="w-7 h-7 text-white/40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </button>
          </div>
          <!-- Shutter button -->
          <button
            type="button"
            @click="captureFrame"
            class="relative flex items-center justify-center"
            style="width: 60px; height: 60px;"
          >
            <span class="absolute inset-0 rounded-full border-2 border-white opacity-90"></span>
            <span class="rounded-full bg-white" style="width: 50px; height: 50px; display:block;"></span>
          </button>
          <!-- Flash button -->
          <div class="flex flex-1 items-center justify-end">
            <button
              type="button"
              @click="toggleFlash"
              class="flex items-center justify-center w-8 h-8 rounded-full transition-all"
              :class="flashOn ? 'bg-yellow-400/90' : 'bg-black/30'"
            >
              <svg
                class="w-6 h-6"
                :class="flashOn ? 'text-black' : 'text-white'"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Camera Flash effect -->
        <div v-if="isCapturing" class="absolute inset-0 z-[100] bg-white animate-pulse"></div>
      </div>

      <!-- PREVIEW / REVIEW VIEW -->
      <div v-if="showPreview" class="flex flex-col bg-[#111]" style="height: 100dvh;">

        <!-- Top bar -->
        <div class="flex items-center justify-between px-4 py-2 shrink-0">
          <button
            type="button"
            @click="showPreview = false"
            class="text-white text-base font-regular drop-shadow text-left flex-1 justify-start items-center h-14"
          >
            <i class="fas fa-chevron-left text-xs m-1"></i>
            Back
          </button>

          <h2 class="text-white font-regular text-sm">
            {{ currentIndex + 1 }} of {{ capturedFrames.length }}
          </h2>

          <div class="flex flex-1 item-center justify-end">
            <button
              type="button"
              @click="saveScanAsPdf"
              :disabled="loading"
              class="flex items-center justify-center py-1 px-3 rounded-full text-sm font-semibold border transition-all"
              :class="loading
                ? 'text-white border-[var(--color-primary)] bg-[var(--color-primary)]'
                : 'text-white border-[var(--color-primary)] bg-[var(--color-primary)]'"
            >
              {{ loading ? 'Saving…' : 'Save PDF' }}
            </button>
          </div>
        </div>

        <!-- Filter Selection -->
        <div class="flex items-center justify-center gap-2 py-3 px-4 shrink-0">
          <button
            v-for="f in ['original', 'scan', 'gray']"
            :key="f"
            @click="currentFilter = f"
            class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            :class="currentFilter === f
              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
              : 'bg-white/5 border-white/10 text-white/60'"
          >
            {{ f === 'original' ? 'Photo' : f.charAt(0).toUpperCase() + f.slice(1) }}
          </button>
        </div>
        <!-- Horizontal gallery -->
        <div
          class="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
          @scroll="(e) => {
            const el = e.target as HTMLElement;
            currentIndex = Math.round(el.scrollLeft / (el.clientWidth * 0.92));
          }"
        >
          <div
            class="flex h-full items-center"
            :class="capturedFrames.length === 1
              ? 'justify-center px-4'
              : 'px-4'"
          >
            <div
              v-for="(frame, index) in capturedFrames"
              :key="index"
              class="relative h-full snap-center shrink-0 flex items-center justify-center"
              :style="{
                width: capturedFrames.length === 1 ? '95%' : '95%'
              }"
            >
              <!-- Inner wrapper -->
              <div
                class="relative w-full h-full flex items-center justify-center"
                :class="capturedFrames.length === 1 ? '' : 'pr-4'"
              >
                <!-- Image -->
                <img
                  :src="filterPreviewCache[index] || frame"
                  :alt="`Página ${index + 1}`"
                  class="w-full max-h-full object-contain rounded-2xl border border-white/10 bg-[#1a1a1a]"
                />

                <!-- Page number -->
                <div class="absolute bg-black/60 flex items-center justify-center rounded-full h-6 w-6 text-white text-xs font-semibold"
                :class="capturedFrames.length === 1 ? 'top-[26px] left-[7px] ' : 'top-9 left-[6px] '">
                  {{ index + 1 }}
                </div>

                <!-- Delete -->
                <button
                  type="button"
                  @click="removeFrame(index)"
                  class="absolute bg-black/60 hover:bg-black/80 active:bg-black/80 rounded-full w-7 h-7 flex items-center justify-center text-white text-xs leading-none transition-colors"
                  :class="capturedFrames.length === 1 ? 'top-[26px] right-[7px] ' : 'top-9 right-[22px]'">
                  ✕
                </button>

              </div>
            </div>
          </div>
        </div>

        <!-- Pagination dots -->
        <div class="flex items-start justify-center gap-1 pb-6 shrink-0">
          <span
            v-for="(_, index) in capturedFrames"
            :key="index"
            class="rounded-full transition-all duration-300"
            :class="currentIndex === index
              ? 'w-5 h-2 bg-[var(--color-primary)]'
              : 'w-2 h-2 bg-white/40'"
          ></span>
        </div>

        <!-- Bottom: add more / discard all -->
        <div class="shrink-0 px-4 py-2 border-t border-white/10 flex gap-2">
          <button
            type="button"
            @click="showPreview = false"
            class="w-full py-1 flex flex-col gap-1 items-center justify-center rounded-full text-white text-xs font-regular opacity-50 hover:opacity-100 transition"
          >
            <img src="/icon/icon-add.svg" alt="trash" class="h-5 inline-block" />
            Add pages
          </button>

          <button
            type="button"
            @click="discardAll"
            class="w-full py-1 flex flex-col gap-1 items-center justify-center rounded-full text-white text-xs font-regular opacity-50 hover:opacity-100 transition"
          >
            <img src="/icon/icon-delate-white.svg" alt="trash" class="h-5 inline-block" />
            Discard all
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
const analysisCanvas = ref<HTMLCanvasElement | null>(null);
const capturedFrames = ref<string[]>([]);
const mediaStream = ref<MediaStream | null>(null);
const loading = ref(false);
const cameraActive = ref(false);
const showPreview = ref(false);
const flashOn = ref(false);
const autoMode = ref(true);
const currentIndex = ref(0);
const documentDetected = ref(false);
const countdown = ref(2);
const isCapturing = ref(false);
const currentFilter = ref('scan');
const filterPreviewCache = ref<string[]>([]);

// ── OpenCV state ──
const cvLoaded = ref(false);
const detectedQuadPoints = ref<{x: number, y: number}[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cv: any = null;

const svgQuadPoints = computed(() => (
  detectedQuadPoints.value.map((p) => `${p.x},${p.y}`).join(' ')
));

// ── auto-detection internals ──
let detectionInterval: ReturnType<typeof setInterval> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let stableFrames = 0;
const STABLE_FRAMES_NEEDED = 6;
const COUNTDOWN_SECONDS = 2;

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
      top: '-8px',
      left: '-8px',
      borderTop: `${t} solid #0A77F3`,
      borderLeft: `${t} solid #0A77F3`,
      borderTopLeftRadius: '16px',
    };
  }
  if (c === 'tr') {
    return {
      ...base,
      top: '-8px',
      right: '-8px',
      borderTop: `${t} solid #0A77F3`,
      borderRight: `${t} solid #0A77F3`,
      borderTopRightRadius: '16px',
    };
  }
  if (c === 'bl') {
    return {
      ...base,
      bottom: '-8px',
      left: '-8px',
      borderBottom: `${t} solid #0A77F3`,
      borderLeft: `${t} solid #0A77F3`,
      borderBottomLeftRadius: '16px',
    };
  }
  return {
    ...base,
    bottom: '-8px',
    right: '-8px',
    borderBottom: `${t} solid #0A77F3`,
    borderRight: `${t} solid #0A77F3`,
    borderBottomRightRadius: '16px',
  };
}

// ── isOpen ──
const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

function getCropCoords() {
  const v = videoElement.value;
  if (!v || !v.videoWidth) return null;

  const videoW = v.videoWidth;
  const videoH = v.videoHeight;
  const rect = v.getBoundingClientRect();
  // Use window dimensions since guides are relative to viewport
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const scale = Math.max(screenW / videoW, screenH / videoH);
  const renderedW = videoW * scale;
  const renderedH = videoH * scale;
  // Offset relative to the video element's own top/left
  const offsetX = (renderedW - screenW) / 2;
  const offsetY = (renderedH - screenH) / 2;

  const guideLeft = (screenW - guideW.value) / 2;
  const guideTop = (screenH - guideH.value) / 2;

  return {
    cropX: Math.round((guideLeft + rect.left + offsetX) / scale),
    cropY: Math.round((guideTop + rect.top + offsetY - 20) / scale),
    cropW: Math.round(guideW.value / scale),
    cropH: Math.round(guideH.value / scale),
    videoW,
    videoH,
    scale,
    offsetX,
    offsetY,
  };
}

function analyzeFrame(): boolean {
  const v = videoElement.value;
  const canvas = analysisCanvas.value;
  if (!v || !canvas || v.readyState < 2) return false;

  const coords = getCropCoords();
  if (!coords) return false;

  const { videoW, videoH } = coords;

  // Work at small resolution for performance
  const scale = 0.2;
  const w = Math.round(videoW * scale);
  const h = Math.round(videoH * scale);
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  ctx.drawImage(v, 0, 0, w, h);

  if (cvLoaded.value && cv) {
    try {
      const src = cv.imread(canvas);
      const dst = new cv.Mat();

      // 1. Pre-process: Grayscale and Contrast Enhancement (CLAHE)
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(dst, dst);
      clahe.delete();

      const blurred = new cv.Mat();
      cv.GaussianBlur(dst, blurred, new cv.Size(5, 5), 0);

      // 2. Edge Detection
      const edges = new cv.Mat();
      cv.Canny(blurred, edges, 50, 150);

      const thresh = new cv.Mat();
      cv.adaptiveThreshold(blurred, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
      cv.bitwise_not(thresh, thresh);
      cv.bitwise_or(edges, thresh, edges);

      // 3. Dilate
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      cv.dilate(edges, edges, kernel);

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      let maxArea = 0;
      let maxContourIndex = -1;

      for (let i = 0; i < contours.size(); i += 1) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        if (area > (w * h * 0.06) && area < (w * h * 0.98)) {
          if (area > maxArea) {
            maxArea = area;
            maxContourIndex = i;
          }
        }
      }

      if (maxContourIndex !== -1) {
        const contour = contours.get(maxContourIndex);
        const hull = new cv.Mat();
        cv.convexHull(contour, hull, false, true);

        const peri = cv.arcLength(hull, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(hull, approx, 0.02 * peri, true);

        if (approx.rows === 4) {
          const pts = [];
          const { scale: scaleFactor, offsetX, offsetY } = coords;

          const analysisToVideoScale = 1 / scale;

          for (let i = 0; i < 4; i += 1) {
            const vx = approx.data32S[i * 2] * analysisToVideoScale;
            const vy = approx.data32S[i * 2 + 1] * analysisToVideoScale;
            pts.push({
              x: (vx * scaleFactor) - offsetX,
              y: (vy * scaleFactor) - offsetY,
            });
          }
          // Sort corners: TL, TR, BR, BL
          const sorted = [...pts];
          // Sum x+y to find TL and BR
          sorted.sort((a, b) => (a.x + a.y) - (b.x + b.y));
          const tl = sorted[0];
          const br = sorted[3];
          // Diff x-y to find TR and BL
          sorted.sort((a, b) => (a.x - a.y) - (b.x - b.y));
          const bl = sorted[0];
          const tr = sorted[3];

          detectedQuadPoints.value = [tl, tr, br, bl];

          src.delete(); dst.delete(); blurred.delete(); edges.delete(); thresh.delete();
          kernel.delete(); contours.delete(); hierarchy.delete(); approx.delete(); hull.delete();
          return true;
        }
        approx.delete();
        hull.delete();
      }

      src.delete(); dst.delete(); blurred.delete(); edges.delete(); thresh.delete();
      kernel.delete(); contours.delete(); hierarchy.delete();
    } catch (e) {
      console.error('OpenCV analysis error:', e);
    }
  }

  detectedQuadPoints.value = [];

  // Fallback to basic brightness logic if OpenCV fails or no quad found
  const {
    cropX, cropY, cropW, cropH,
  } = coords;
  const sx = Math.round(cropX * scale);
  const sy = Math.round(cropY * scale);
  const sw = Math.round(cropW * scale);
  const sh = Math.round(cropH * scale);
  const safeX = Math.max(0, sx);
  const safeY = Math.max(0, sy);
  const safeW = Math.min(sw, w - safeX);
  const safeH = Math.min(sh, h - safeY);
  if (safeW <= 0 || safeH <= 0) return false;

  const innerData = ctx.getImageData(safeX, safeY, safeW, safeH).data;
  let innerBrightness = 0;
  for (let i = 0; i < innerData.length; i += 4) {
    innerBrightness += (innerData[i] * 299 + innerData[i + 1] * 587 + innerData[i + 2] * 114) / 1000;
  }
  innerBrightness /= (innerData.length / 4);

  return innerBrightness > 160; // Simplified fallback
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdown.value = COUNTDOWN_SECONDS;
}

// capture
async function applyFilter(srcBase64: string, filter: string): Promise<string> {
  if (filter === 'original') return srcBase64;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(srcBase64);
        return;
      }
      ctx.drawImage(img, 0, 0);

      if (cvLoaded.value && cv && filter !== 'original') {
        try {
          const src = cv.imread(canvas);
          const dst = new cv.Mat();
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

          if (filter === 'scan') {
            // Sharpen before threshold
            const kernel = cv.matFromArray(3, 3, cv.CV_32F, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
            cv.filter2D(dst, dst, cv.CV_8U, kernel);
            kernel.delete();
            // Adaptive threshold with better parameters for clean background
            cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 21, 10);
          }
          // if gray, just keep the cvtColor result

          cv.imshow(canvas, dst);
          src.delete(); dst.delete();
          resolve(canvas.toDataURL('image/jpeg', 0.9));
          return;
        } catch (e) {
          console.error('CV filter error:', e);
        }
      }

      // Manual fallback if CV fails
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (filter === 'scan') {
          const val = gray > 128 ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        } else {
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = srcBase64;
  });
}

function captureFrame() {
  if (!videoElement.value) return;
  const v = videoElement.value;
  isCapturing.value = true;
  setTimeout(() => { isCapturing.value = false; }, 200);

  const coords = getCropCoords();
  if (!coords) return;

  const { videoW, videoH } = coords;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (cvLoaded.value && cv && detectedQuadPoints.value.length === 4) {
    // Advanced Perspective Warp
    const src = cv.imread(v);
    const dst = new cv.Mat();

    // Map screen coordinates back to video coordinates
    const videoRect = v.getBoundingClientRect();
    const screenW = videoRect.width;
    const screenH = videoRect.height;

    const { scale: scaleFactor, offsetX, offsetY } = coords;

    const coordsArr: number[] = [];
    detectedQuadPoints.value.forEach((p) => {
      coordsArr.push((p.x + offsetX) / scaleFactor);
      coordsArr.push((p.y + offsetY) / scaleFactor);
    });

    const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, coordsArr);

    // Target rectangle (A4 ratio)
    const targetW = 1200;
    const targetH = Math.round(targetW * 1.414);
    const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, targetW, 0, targetW, targetH, 0, targetH]);

    const M = cv.getPerspectiveTransform(srcCoords, dstCoords);
    cv.warpPerspective(src, dst, M, new cv.Size(targetW, targetH), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    canvas.width = targetW;
    canvas.height = targetH;
    cv.imshow(canvas, dst);

    src.delete(); dst.delete(); srcCoords.delete(); dstCoords.delete(); M.delete();
  } else {
    // Basic Crop Fallback
    const {
      cropX, cropY, cropW, cropH,
    } = coords;
    canvas.width = cropW;
    canvas.height = cropH;
    ctx.drawImage(v, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  }

  capturedFrames.value.push(canvas.toDataURL('image/jpeg', 0.92));
  documentDetected.value = false;
  stableFrames = 0;

  store.commit('notifications/addNotification', {
    message: `Page ${capturedFrames.value.length} captured`,
    type: 'success',
  });
}

function startCountdown() {
  countdown.value = COUNTDOWN_SECONDS;
  countdownInterval = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      stopCountdown();
      captureFrame();
    }
  }, 1000);
}

function startDetection() {
  if (detectionInterval) return;
  stableFrames = 0;
  detectionInterval = setInterval(() => {
    if (!autoMode.value || showPreview.value) return;

    const detected = analyzeFrame();

    if (detected) {
      stableFrames += 1;
      if (stableFrames >= STABLE_FRAMES_NEEDED && !documentDetected.value) {
        documentDetected.value = true;
        startCountdown();
      }
    } else {
      stableFrames = 0;
      if (documentDetected.value) {
        documentDetected.value = false;
        stopCountdown();
      }
    }
  }, 200);
}

function stopDetection() {
  if (detectionInterval) {
    clearInterval(detectionInterval);
    detectionInterval = null;
  }
  stopCountdown();
  documentDetected.value = false;
  stableFrames = 0;
}

// camera
async function startCamera() {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
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
    // Load OpenCV if not loaded
    if (!cvLoaded.value) {
      if ((window as any).cv && (window as any).cv.Mat) {
        cv = (window as any).cv;
        cvLoaded.value = true;
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/opencv.js-pure@4.10.0/opencv.js';
        script.async = true;
        script.onload = () => {
          const checkCV = () => {
            if ((window as any).cv && (window as any).cv.Mat) {
              cv = (window as any).cv;
              cvLoaded.value = true;
              console.log('OpenCV.js Initialized');
            } else {
              setTimeout(checkCV, 100);
            }
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).cv) {
            (window as any).cv.onRuntimeInitialized = () => {
              checkCV();
            };
            // Safety: some versions don't fire onRuntimeInitialized or it fires too early
            setTimeout(checkCV, 500);
          }
        };
        script.onerror = () => {
          console.error('Failed to load OpenCV from CDN');
        };
        document.head.appendChild(script);
      }
    }
    // Start detection after a short delay so video stabilizes
    setTimeout(startDetection, 800);
  }
}

function stopCamera() {
  stopDetection();
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

function removeFrame(index: number) {
  capturedFrames.value.splice(index, 1);
  if (capturedFrames.value.length === 0) showPreview.value = false;
}

function discardAll() {
  capturedFrames.value = [];
  showPreview.value = false;
}

// ── close ──
function closeModal() {
  isOpen.value = false;
  stopCamera();
  capturedFrames.value = [];
  showPreview.value = false;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal();
    e.stopImmediatePropagation();
  }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsPDF = (jsPDFModule as any).jsPDF
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?? (jsPDFModule as any).default?.jsPDF
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?? (jsPDFModule as any).default;
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw: number = pdf.internal.pageSize.getWidth();
    const ph: number = pdf.internal.pageSize.getHeight();

    const images = await Promise.all(
      capturedFrames.value.map(async (f) => {
        const filtered = await applyFilter(f, currentFilter.value);
        return loadImage(filtered);
      }),
    );
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

// ── watchers ──
watch(
  () => showPreview.value,
  (v) => {
    if (v) stopDetection();
    else if (cameraActive.value) startDetection();
  },
);

// Sync preview cache when filter, visibility or page count changes
watch(
  [() => showPreview.value, () => currentFilter.value, () => capturedFrames.value.length],
  async ([show, filter]) => {
    if (show && capturedFrames.value.length > 0) {
      loading.value = true;
      const updated = await Promise.all(
        capturedFrames.value.map((frame) => applyFilter(frame, filter as string)),
      );
      filterPreviewCache.value = updated;
      loading.value = false;
    }
  },
);

// ── pause detection when autoMode is off ──
watch(
  () => autoMode.value,
  (v) => {
    if (!v) {
      stopDetection();
      documentDetected.value = false;
    } else if (cameraActive.value) {
      startDetection();
    }
  },
);

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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
