<template>
  <!-- actions -->
  <!-- upload progress bar -->
  <!-- uploading file indicator -->
  <div v-if="loading" class="mb-4">
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span class="
              text-xs font-semibold uppercase
              inline-block
              py-1 px-2
              rounded-full
              text-[#0A77F3]
              bg-white
            ">
            Subiendo archivo
          </span>
          <span class="text-xs font-semibold inline-block text-[#0A77F3]">
            {{ file?.name }}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-[#0A77F3]">
            {{ Math.round(100 * progress) }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#7DBAFF]">
        <div :style="{ width: `${Math.round(100 * progress)}%` }" class="
            shadow-none
            flex flex-col
            text-center whitespace-nowrap text-white
            justify-center
            bg-purple-500
          "></div>
      </div>
    </div>
  </div>

  <div class="
      flex flex-row items-start
      bg-white h-[800px]
      font-alexandria
    ">
    <!--files sidebar-->
    <div class="flex w-[250px] h-full bg-[#EDF5FF] pt-4">
      <router-link to="/app/files" class="
        flex items-center
        bg-[#ffffff]
        h-8 w-full
        pl-8
        py-6
        text-lg font-semibold text-[#3d3d3d] font-Alexandria
        border-l-4 border-white
        hover:border-l-4 hover:border-[#0A77F3]
        ">
        <img src="/icon/icon-cloudDrive.svg" alt="icon" class="h-6 mr-3" />
        Cloud drive
      </router-link>
    </div>
    <!--right side -->
    <div class="flex-1 flex flex-col h-full items-start px-8 pt-6">
      <label for="fileInput" class="
          flex items-center
          bg-[#0A77F3]
          text-white text-md font-medium
          py-2 px-4
          rounded-full
          cursor-pointer
          hover:ring-4 hover:ring-[#0B77F3]/50
          focus:ring-4 focus:ring-[#0B77F3]/50
          transition-all duration-300 ease-in-out
        " :class="{ 'opacity-50': loading }">
        <img src="/icon/icon-upload.svg" alt="icon" class="h-6 mr-3" />
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

      <DragDrop v-if="filesLength === 0" :loading="loading" />

      <router-view v-else></router-view>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';

const DragDrop = defineAsyncComponent(() => import('@/components/app/dragdrop.vue'));

const store = useStore();

const progress = computed<number>(() => store.state.files.uploadProgress);
const filesLength = computed<number>(() => store.state.files.result.data.length);
// const filesLength = ref<number>(0);

const loading = ref(false);
const file = ref<File | null>(null);

// Lógica original de subida (sin cambios)
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

</script>
