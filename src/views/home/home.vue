<template>
  <div>
    <!-- Hero Section -->
    <heroSection />
    <!-- Features Section -->
    <featuresSection />
    <!-- Users testimonial -->
    <testimonialSection />
  <!-- map Section -->
    <mapSection />
</div>
</template>
<script setup>
import {
  ref,
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const heroSection = defineAsyncComponent(() => import('./hero.vue'));
const featuresSection = defineAsyncComponent(() => import('./features.vue'));
const mapSection = defineAsyncComponent(() => import('./map.vue'));
const testimonialSection = defineAsyncComponent(() => import('./testimonial.vue'));

const email = ref('');
const message = ref('');
const isError = ref(false);

function submit() {
  if (!email.value || !email.value.includes('@')) {
    message.value = 'Please enter a valid email address.';
    isError.value = true;
  } else {
    message.value = 'Thanks! We’ve received your email.';
    isError.value = false;
    // Opcional: limpiar después de unos segundos
    setTimeout(() => {
      message.value = '';
      email.value = '';
    }, 3100);
  }
}
</script>
<style scoped>
.btn-nav {
  @apply w-10 h-10 rounded-full
  border border-blue-500 text-blue-500 hover:bg-blue-100 transition
  flex items-center justify-center;
}
.icon {
  @apply w-4 h-4;
}
@keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0.95);
    filter: brightness(2);
  }
  50% {
    filter: brightness(1.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1);
  }
}

.sparkle-in {
  animation: sparkle 0.5s ease-in-out forwards;
}
</style>
