<template>
  <!-- actions -->
  <!-- upload progress bar -->
  <div v-if="loading" class="mb-4">
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span
            class="
              text-xs font-semibold uppercase
              inline-block
              py-1 px-2
              rounded-full
              text-purple-600
              bg-purple-200
            "
          >
            Subiendo archivo
          </span>
          <span class="text-xs font-semibold inline-block text-purple-600">
            {{ file?.name }}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-purple-600">
            {{ Math.round(100 * progress) }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
        <div
          :style="{ width: `${Math.round(100 * progress)}%` }"
          class="
            shadow-none
            flex flex-col
            text-center whitespace-nowrap text-white
            justify-center
            bg-purple-500
          "
        ></div>
      </div>
    </div>
  </div>
  <div
    class="
      flex flex-row items-start
      bg-white h-[800px]
      font-alexandria
    "
  >
  <!--left side-->
  <div class="flex w-[250px] h-full bg-[#EDF5FF] pt-4">
    <router-link
      to="/app/files"
      class="
        flex items-center
        bg-[#ffffff]
        h-8 w-full
        pl-8
        py-6
        text-lg font-bold text-[#3d3d3d] font-Alexandria
        border-l-4 border-white
        hover:border-l-4 hover:border-[#0A77F3]
        ">
    <img
      src="/icon/icon-cloudDrive.svg"
      alt="icon"
      class="h-6 mr-2"
      />
    Cloud drive
    </router-link>
  </div>
  <!--right side -->
    <div class="flex-1 flex flex-col h-full items-start px-8 pt-6">
      <label
        for="fileInput"
        class="
          flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          py-2 px-4
          rounded-full
          cursor-pointer
          hover:ring-4 hover:ring-[#0B77F3]/50
          focus:ring-4 focus:ring-[#0B77F3]/50
          transition-all duration-300 ease-in-out
        "
        :class="{ 'opacity-50': loading }"
      >
      <img
        src="/icon/icon-upload.svg"
        alt="icon"
        class="h-6 mr-3"
      />
      <span>Upload</span>

      <input
        id="fileInput"
        type="file"
        class="hidden"
        ref="fileInput"
        @change="uploadFile"
        :multiple="false"
        :disabled="loading"
        />
      </label>

      <!-- Drag & Drop area -->
      <div
        class="
          flex items-center justify-center
          w-full h-full
          rounded-xl mt-6
          border-2 transition-colors duration-300
        "
        :class="[
          hasFiles
            ? 'border-solid border-[#9DC9FA]' // 🟨 cuando hay archivo
            : 'border-dashed border-[#9DC9FA]', // 🟨 cuando NO hay archivo
          isDragging && !hasFiles ? 'bg-[#E9F3FF] border-[#0A77F3]' : ''
          ]"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
         <!-- Mostrar zona de carga solo si no hay archivos -->
        <div v-if="!hasFiles" class="flex flex-col items-center pointer-events-none">
          <img
            src="/icon/icon-cloudUpload.svg"
            alt="icon"
            class="w-[250px] m-0 opacity-100"
          />
          <h1 class="text-2xl text-center text-[#3d3d3d] font-bold mb-6">
            Nothing in your private vault yet
          </h1>
          <p class="text-md text-center text-[#a3a3a3] font-light mb-6">
            Drag and drop your files here
          </p>
          <label
            for="fileInput"
            class="
              flex items-center
              bg-[#0A77F3]
              text-white text-md font-medium
              py-2 px-8
              rounded-full
              cursor-pointer
              hover:ring-4 hover:ring-[#0B77F3]/50
              focus:ring-4 focus:ring-[#0B77F3]/50
              transition-all duration-300 ease-in-out
              pointer-events-auto
            "
            :class="{ 'opacity-50': loading }"
            >
            <img
              src="/icon/icon-upload.svg"
              alt="icon"
              class="h-6 mr-3"
            />
            <span>Upload</span>
            <input
              id="fileInput"
              type="file"
              class="hidden"
              ref="fileInput"
              @change="uploadFile"
              :multiple="false"
              :disabled="loading"
            />
          </label>
        </div>
        <div v-else class="text-center text-[#3d3d3d]">
          <p class="text-lg font-medium">File uploaded: {{ file?.name }}</p>
        </div>
      </div>
      <!-- End Drag & Drop area -->

    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const loading = ref(false);
const file = ref<File | null>(null);
const isDragging = ref(false); // Drag & Drop
const hasFiles = computed(() => !!file.value); // Nuevo: indica si ya hay archivo

const progress = computed<number>(() => store.state.files.uploadProgress);

// 🟦 Lógica original de subida (sin cambios)
async function uploadFile(ev: Event): Promise<void> {
  loading.value = true;
  try {
    const target = ev.target as HTMLInputElement;
    if (!target.files) {
      return;
    }

    [file.value] = target.files;
    const formData = new FormData();
    formData.append('file', file.value);

    await store.dispatch('files/upload', formData);
    store.commit('notifications/addNotification', {
      type: 'success',
      message: 'Archivo subido correctamente',
    });
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.error || 'Error al subir el archivo';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    loading.value = false;
  }
}

// Drag & Drop: funciones
function onDragEnter(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = true;
}

function onDragOver(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = true;
}

function onDragLeave(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = false;
}

async function onDrop(ev: DragEvent) {
  ev.preventDefault();
  isDragging.value = false;

  if (!ev.dataTransfer || !ev.dataTransfer.files.length) return;

  const droppedFile = ev.dataTransfer.files[0];
  if (!droppedFile) return;

  const fakeEvent = {
    target: { files: [droppedFile] },
  } as unknown as Event;

  await uploadFile(fakeEvent);
}
</script>
