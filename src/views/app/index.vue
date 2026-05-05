<template>
  <div class="">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isAuth = computed(() => store.getters['auth/isAuth']);

onMounted(() => {
  if (!isAuth.value) {
    store.dispatch('auth/logout');
  }
});
</script>
