<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

onMounted(() => {
  const isAuth = store.getters['auth/isAuth'];
  if (!isAuth) {
    store.dispatch('auth/logout');
  }
});
</script>
