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
          absolute
          right-0
          mt-2 w-80 max-w-[calc(100vw-2rem)] p-2
          bg-gray-200
          --border rounded shadow-xl z-50
        "
      >
        <slot name="content" :close="close" />
      </div>
    </transition>
  </div>
</template>
