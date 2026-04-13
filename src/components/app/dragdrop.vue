<template>
  <div
    class="
      flex items-center justify-center
      w-full h-full mx-auto my-auto
      rounded-xl mb-8 z-50
      transition-colors duration-300
    "
    :class="[
      hasFiles
        ? 'border-solid border-[#9DC9FA]'
        : 'border-dashed border-[#9DC9FA]',
    ]"
  >
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const loading = ref(false);

const file = ref<File | null>(null);
const hasFiles = computed(() => !!file.value); // Nuevo: indica si ya hay archivo

</script>
