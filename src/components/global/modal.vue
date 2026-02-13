<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('update:modelValue', false)"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="
          relative
          bg-[var(--bg-secondary)]
          border border-[var(--border)]
          w-full max-w-sm
          transform
          overflow-hidden
          rounded-2xl
          px-6 py-4
          text-left
          shadow-xl
        "
      >
        <!-- Header -->
        <div class="mb-4">
          <h3 class="text-md font-medium leading-6 text-white">
            <slot name="header">Modal Title</slot>
          </h3>
        </div>

        <!-- Content -->
        <div class="mt-2 text-[#7f7f7f] text-sm">
          <slot name="content">Default content goes here</slot>
        </div>

        <!-- Footer -->
        <div class="mt-4 flex justify-end space-x-2">
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
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['update:modelValue']);

</script>
