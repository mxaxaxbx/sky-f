<script setup lang="ts">
import {
  ref,
  onUnmounted,
  defineEmits,
} from 'vue';

const emit = defineEmits(['close']);

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

// Cleanup on unmount
onUnmounted(() => {
  isOpen.value = false;
});
</script>

<template>
  <div class="relative inline-block" v-click-outside="close">
    <!-- Trigger slot -->
    <slot name="trigger" :isOpen="isOpen" :toggle="toggle" />

    <!-- Dropdown content -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="
          fixed inset-0
          w-screen h-screen
          pt-10 mt-10
          bg-[var(--bg)]

          border border-[var(--border)]
          rounded-2xl
          shadow-lg z-50

          sm:absolute sm:inset-auto
          sm:right-0
          sm:pt-8 sm:pb-6
          sm:mt-2
          sm:h-auto sm:w-80
          sm:right-0
          -translate-y-1

          overflow-hidden
      ">
        <slot name="content" :close="close" />
      </div>
    </transition>
  </div>
</template>
