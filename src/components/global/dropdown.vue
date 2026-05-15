<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
} from 'vue';

const props = defineProps({
  classes: {
    type: Array as () => string[],
    default: () => [
      'fixed inset-0 z-50',
      'w-screen h-screen',
      'pt-10 mt-10',
      'bg-[var(--bg)]',
      'border border-[var(--border)]',
      'rounded-2xl',
      'shadow-sm z-9999',
      'sm:absolute sm:inset-auto',
      'sm:right-0',
      'sm:pt-8 sm:pb-6',
      'sm:mt-2',
      'sm:h-auto',
      'sm:w-80',
      '-translate-y-1',
      'overflow-hidden',
    ],
  },
});

const emit = defineEmits(['close']);

const isOpen = ref(false);
const dropdownId = Math.random().toString(36).substr(2, 9);

const toggle = () => {
  if (!isOpen.value) {
    window.dispatchEvent(new CustomEvent('close-all-dropdowns', { detail: { id: dropdownId } }));
  }
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const handleCloseAll = (event: any) => {
  if (event.detail?.id !== dropdownId) {
    isOpen.value = false;
  }
};

// Swipe to close logic
const touchStartY = ref(0);
const touchCurrentY = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const deltaY = e.touches[0].clientY - touchStartY.value;
  touchCurrentY.value = deltaY;
};

const handleTouchEnd = () => {
  if (Math.abs(touchCurrentY.value) > 20) {
    close();
  }
  touchCurrentY.value = 0;
  isDragging.value = false;
};

onMounted(() => {
  window.addEventListener('close-all-dropdowns', handleCloseAll);
});

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('close-all-dropdowns', handleCloseAll);
  isOpen.value = false;
});
</script>

<template>
  <div class="relative inline-block" v-click-outside="close">
    <!-- Trigger slot -->
    <slot name="trigger" :isOpen="isOpen" :toggle="toggle" :close="close" />

    <!-- Dropdown content -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="props.classes"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        :style="{
          transform: `translateY(${touchCurrentY}px)`,
          transition: touchCurrentY === 0 ? 'transform 0.5s ease' : 'none'
        }"
      >
        <slot name="content" :close="close" />
      </div>
    </transition>
  </div>
</template>

<style>
.backdrop-blur-md {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}
</style>
