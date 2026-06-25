<template>
  <div>
    Please wait while we confirm your session...
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();

onMounted(() => {
  try {
    const { token, redirect } = route.query;
    store.dispatch('auth/confirmSession', {
      token,
      redirect,
    });
  } catch (err: any) {
    const message = err?.response?.data?.error || 'Ocurrió un error al validar el código';
    console.error('auth/validatecode validatecode', err);
    store.commit('notifications/addNotification', {
      message,
      type: 'error',
    });
  }
});
</script>
