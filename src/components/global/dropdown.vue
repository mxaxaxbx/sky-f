<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  nextTick,
} from 'vue';

const props = defineProps({
  classes: {
    type: Array as () => string[],
    default: () => [
      'fixed inset-0 z-50',
      'w-screen h-screen',
      'pt-10 mt-10',
      'bg-[var(--bg)]/90',
      'border border-[var(--border)]',
      'rounded-2xl',
      'shadow-sm z-9999',

      'sm:absolute sm:inset-auto',
      'sm:right-0',
      'sm:pt-8 sm:pb-6',
      'sm:mt-2',
      'sm:h-auto',
      'sm:w-80',

      'overflow-hidden',
      'backdrop-blur-md',
    ],
  },
});

const emit = defineEmits(['close']);

const isOpen = ref(false);

const dropdownId = Math.random()
  .toString(36)
  .substr(2, 9);

const dropdownRef = ref<HTMLElement | null>(null);

const dropdownOffset = ref(0);

const toggle = async () => {
  if (!isOpen.value) {
    window.dispatchEvent(
      new CustomEvent('close-all-dropdowns', {
        detail: { id: dropdownId },
      }),
    );
  }

  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    dropdownOffset.value = 0;

    await nextTick();

    const rect = dropdownRef.value?.getBoundingClientRect();

    if (!rect) return;

    const overflowRight = rect.right - window.innerWidth;

    dropdownOffset.value = overflowRight > 0
      ? -(overflowRight + 2)
      : 0;
  }
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

const touchStartY = ref(0);
const touchCurrentY = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
  touchCurrentY.value = 0;
  isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;

  const deltaY = e.touches[0].clientY - touchStartY.value;
  touchCurrentY.value = deltaY;

  if (deltaY < -80) {
    close();
  }
};

const handleTouchEnd = () => {
  if (touchCurrentY.value > 20) {
    close();
  }

  touchCurrentY.value = 0;
  isDragging.value = false;
};

onMounted(() => {
  window.addEventListener(
    'close-all-dropdowns',
    handleCloseAll,
  );
});

onUnmounted(() => {
  window.removeEventListener(
    'close-all-dropdowns',
    handleCloseAll,
  );

  isOpen.value = false;
});
</script>

<template>
  <div
    class="relative inline-block"
    v-click-outside="close"
  >
    <slot
      name="trigger"
      :isOpen="isOpen"
      :toggle="toggle"
      :close="close"
    />

    <transition
  enter-active-class="
    transition-all
    duration-200
    ease-out
  "
  enter-from-class="
    opacity-0
    scale-y-0
  "
  enter-to-class="
    opacity-100
    scale-y-100
  "
  leave-active-class="
    transition-all
    duration-150
    ease-in
  "
  leave-from-class="
    opacity-100
    scale-y-100
  "
  leave-to-class="
    opacity-0
    scale-y-0
  "
>
  <div
    v-if="isOpen"
    ref="dropdownRef"
    :class="[
      ...props.classes,
      'origin-top',
    ]"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    :style="{
      left: `${dropdownOffset}px`,
      transform: `translateY(${touchCurrentY}px)`,
      willChange: 'transform, opacity',
    }"
  >
    <slot
      name="content"
      :close="close"
    />
  </div>
</transition>
  </div>
</template>

<style>
.backdrop-blur-md {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}
</style>
