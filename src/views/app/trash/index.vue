<template>
  actions
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

import { FolderI } from '@/store/folders/state';

const store = useStore();

const loading = ref(false);

const trashFolder = computed<FolderI>(() => store.state.folders.trashFolder);

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

onMounted(() => {
  getTrashFolder();
});
</script>
