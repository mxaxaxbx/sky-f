<template>
  <div class="fixed top-0 px-5 right-0 w-96 z-[99999]">
    <div
      v-for="(notification, index) in notifications"
      :key="index"
      class="mt-2 rounded-2xl px-2 py-1 z-999 border shadow mb-2 text-[#3d3d3d]"
      :class="{
        'border-[var(--error-border)] bg-[var(--error-bg)]': notification.type === 'error',
        'border-[var(--success-border)] bg-[var(--success-bg)]': notification.type === 'success',
        'border-[var(--info-border)] bg-[var(--info-bg)]': notification.type === 'info',
        'border-[var(--warning-border)] bg-[var(--warning-bg)]': notification.type === 'warning',
        'border-[#3d3d3d] bg-white': notification.type === 'default',
      }"
    >
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="mr-5">
            <img
              :src="getIcon(notification.type)"
              alt="notification icon"
              class="w-6"
            />
          </div>
          <div>
            <p class="font-semibold text-normal text-[var(--text)]">{{ notification.title }}</p>
            <p class="font-light text-sm text-[var(--text)]">{{ notification.message }}</p>
          </div>
        </div>
        <div>
          <button
            @click="removeNotification(notification.id)"
            class="text-[var(--text)]"
          >
            <i class="fas fa-times" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

import { NotificationI } from '@/store/notifications/state';

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return '/icon/icon-success.svg';
    case 'error':
      return '/icon/icon-error.svg';
    case 'info':
      return '/icon/icon-info.svg';
    case 'warning':
      return '/icon/icon-warning.svg';
    default:
      return '/icon/icon-notification.svg';
  }
}

const store = useStore();

const notifications = computed<NotificationI[]>(() => store.state.notifications.notifications);
// get the current date unix timestamp
const now = ref(moment().format('X'));
const interval = ref(0);

function updateNow() {
  interval.value = setInterval(() => {
    now.value = moment().format('X');
  }, 1000);
}

function removeNotification(id: string) {
  store.commit('notifications/removeNotification', id);
}

onMounted(async () => {
  updateNow();
});

// watch each second
watch(now, (newVal) => {
  if (notifications.value.length === 0) {
    return;
  }

  const notificationsReverse = [...notifications.value].reverse();

  // get the last one
  const lastNotification = notificationsReverse[notificationsReverse.length - 1];
  if (lastNotification) {
    const diff = lastNotification.closeIn - Number(newVal);
    if (diff < 0) {
      removeNotification(lastNotification.id);
    }
  }
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});

</script>
