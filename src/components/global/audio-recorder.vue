<template>
  <Transition name="panel">
    <div
      v-if="showRecorder"
      class="fixed bottom-0 left-0 w-full bg-[var(--bg-modal-2)] backdrop-blur-xl border-t border-[var(--border)] rounded-t-[3rem] z-[100] pb-10 pt-6 px-6 flex flex-col items-center"
    >
      <div class="w-12 h-1.5 bg-[var(--border)] rounded-full mb-8 opacity-50"></div>

      <div class="text-[var(--text)] text-3xl font-light tracking-widest mb-10">
        {{ formattedTime }}
      </div>

      <div class="relative flex items-center justify-center">
        <button
          @click="toggleRecording"
          class="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 active:scale-95"
          :class="{ 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]': isRecording, 'bg-transparent': !isRecording }"
        >
          <div
            class="transition-all duration-300"
            :class="isRecording ? 'w-6 h-6 bg-white rounded-sm' : 'w-14 h-14 bg-red-500 rounded-full'"
          ></div>
        </button>
      </div>

      <button
        @click="closeRecorder"
        class="mt-8 text-[var(--text-terceary)] text-sm font-medium hover:text-[var(--text)] transition-colors"
      >
        {{ isRecording ? 'Stop and Cancel' : 'Close' }}
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isRecording = computed(() => store.state.isRecording);
const showRecorder = computed(() => store.state.showRecorder);
const currentFolderId = computed(() => store.state.recorderFolderId);

const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
let timerInterval: number | undefined;

function stopTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

watch(showRecorder, (newVal) => {
  recordingTime.value = 0;
  if (!newVal) {
    stopTimer();
  }
});

const formattedTime = computed(() => {
  const h = Math.floor(recordingTime.value / 3600).toString().padStart(2, '0');
  const m = Math.floor((recordingTime.value % 3600) / 60).toString().padStart(2, '0');
  const s = (recordingTime.value % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
});

function stopRecording(cancel = false) {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    if (cancel) {
      mediaRecorder.value.onstop = null;
    }
    mediaRecorder.value.stop();
    store.commit('setRecording', false);
    stopTimer();
    recordingTime.value = 0;
    if (!cancel) {
      store.commit('setRecorder', { show: false });
    }
  }
}

function closeRecorder() {
  if (isRecording.value) {
    stopRecording(true); // cancel
  }
  store.commit('setRecorder', { show: false });
  recordingTime.value = 0;
}

function startTimer() {
  recordingTime.value = 0;
  timerInterval = window.setInterval(() => {
    recordingTime.value += 1;
  }, 1000);
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: 'audio/webm' };

    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      delete (options as any).mimeType;
    }

    mediaRecorder.value = new MediaRecorder(stream, options);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      const mimeType = mediaRecorder.value?.mimeType || 'audio/webm';
      const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';
      const audioBlob = new Blob(audioChunks.value, { type: mimeType });
      const audioFile = new File([audioBlob], `recording_${Date.now()}.${extension}`, { type: mimeType });

      const formData = new FormData();
      formData.append('file', audioFile);

      try {
        await store.dispatch('files/upload', {
          formData,
          folderId: currentFolderId.value,
        });
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
      } finally {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    mediaRecorder.value.start();
    store.commit('setRecording', true);
    startTimer();
  } catch (error) {
    console.error('Error accessing microphone:', error);
    store.commit('notifications/addNotification', {
      message: 'No se pudo acceder al micrófono',
      type: 'error',
    });
  }
}

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
}

onBeforeUnmount(() => {
  if (timerInterval) window.clearInterval(timerInterval);
});
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
