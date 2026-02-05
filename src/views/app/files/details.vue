<template>
  {{file}}
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import { FileI } from '@/store/files/state';

const store = useStore();
const route = useRoute();

const file = computed<FileI>(() => store.state.files.file);
const loading = ref(false);

async function getFileDetails() {
  loading.value = true;
  try {
    await store.dispatch('files/getFileDetails', route.params.id as string);
  } catch (error) {
    console.log(error);
    store.commit('notifications/addNotification', {
      type: 'error',
      message: 'Error al obtener los detalles del archivo',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getFileDetails();
});
</script>
