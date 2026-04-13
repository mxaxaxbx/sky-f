<template>
  <div v-if="modelValue" class="fixed inset-0 z-[99999] overflow-y-auto">
    <!-- Backdrop -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm"
      @click="$emit('update:modelValue', false)"
    >
    </div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center mx-2  sm:items-start sm:pt-[20vh]">
      <div
        class="
          relative
          bg-[var(--bg-secondary)]
          border border-[var(--border)]
          w-full py-2
          transform
          overflow-hidden
          rounded-2xl
          text-left
          shadow-xl
        "
        :class="[
          borderClass,
          {
          'max-w-xs': size === 'xs',
          'max-w-sm': size === 'sm',
          'max-w-md': size === 'md',
          'max-w-lg': size === 'lg',
          'max-w-xl': size === 'xl',
          }
          ]
        "
      >
        <!-- Header -->
        <div class="mb-4 border-b border-[var(--border)] px-4">
          <h3 class="text-lg font-semibold text-[var(--text)] pb-1">
            <slot name="header">Modal Title</slot>
          </h3>
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="
              absolute right-1.5 top-1.5 px-1 py-0.5
              text-md border border-transparent rounded-xl
              text-[var(--text-terceary)]
              bg-[var(--bg-secondary)]
              hover:text-[var(--color-primary)]
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

              transition-all duration-300
            "
          >
            <i class="fa-solid fa-xmark m-1"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="mt-2 text-[var(--text-terceary)] text-sm px-4">
          <slot name="content">Default content goes here</slot>
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="mb-2 mt-4 flex justify-end space-x-2 px-4">
          <slot name="footer">
            <button
              @click="$emit('update:modelValue', false)"
              class="
                inline-flex justify-center
                rounded-full
                border border-[#7f7f7f]
                bg-[#3d3d3d]
                px-4 py-0
                text-sm font-regular text-white
                hover:bg-[#FF242C] hover:border-[#FF242C] hover:text-white
                hover:ring-2 hover:ring-[#FF242C]/50
              "
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from 'vue';

const props = defineProps({
  modelValue: Boolean,
  size: {
    type: String,
    default: 'lg',
  },
  borderClass: {
    type: String,
    default: 'border-[var(--border)]',
  },
});

const emit = defineEmits(['update:modelValue']);

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false);
    e.stopImmediatePropagation();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, true);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown, true);
});

</script>
