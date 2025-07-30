<template>
  <div>
    <!-- Hero Section -->
    <heroSection />
    <!-- Features Section -->
    <featuresSection />
    <!-- map Section -->
    <section class="bg-[#EDF5FF] font-alexandria
      flex flex-row items-center justify-between
      pb-[90px] px-64">
      <object
        id="Icons"
        aria-label="Icons SVG"
        type="image/svg+xml"
        data="dgsky-mapa.svg"
        class="w-72 md:w-80 lg:w-[700px] h-auto z-30"
      ></object>
      <div class="">
  <h3 class="text-5xl text-left text-[#3D3D3D] font-bold mb-10">
    Trusted by Thousands <br /> Worldwide
  </h3>

  <p class="text-md text-left text-[#797979] font-semibold">
    Create your account and start storing your files with total peace of mind. <br />
    Access them anytime, anywhere, and share them effortlessly with the people <br />
    you trust the most.
  </p>

  <!-- WRAPPER para centrar -->
  <div class="w-full mt-10 flex flex-col justify-center">
    <!-- FORMULARIO -->
    <div
  class="flex items-center w-[470px] rounded-full border border-[#0A77F3]
  transition-colors duration-300 focus-within:bg-white bg-transparent">
      <label for="email-input" class="sr-only">Email</label>
      <input
        id="email-input"
        type="email"
        v-model="email"
        placeholder="Enter your email"
        class="w-full font-semibold text-[#0A77F3] bg-transparent px-6 py-2
        focus:outline-none placeholder-[#71C4FF] placeholder:text-lg placeholder:font-normal"
      />
      <button
        @click="submit"
        class="bg-[#0A77F3] text-lg text-white font-semibold px-8 py-3 rounded-full"
      >
        Submit
      </button>
    </div>
     <!-- ALERTA -->
     <p
  :class="[
    'min-h-[1.5rem] ml-8 mt-4 text-left text-sm font-semibold transition-all duration-300',
    message ? 'opacity-100 visible ' : 'opacity-0 invisible',
    isError ? 'text-red-500' : 'text-green-600'
  ]"
>
  {{ message || '‎' }}
</p>
  </div>
</div>
    </section>
    <!-- Users Section -->
    <section class="container mx-auto py-16">
      <div class="bg-purple-600 text-white p-12 rounded-lg text-center">
      <h2 class="text-3xl font-bold mb-6"> Join thousands of users who trust our platform </h2>
      <p class="text-lg mb-8">
        Sign up and start storing your files securely.
        Access them from anywhere and share with ease!
      </p>
      <a
        href="#"
        class="bg-white text-purple-600 px-8 py-3 rounded-full shadow hover:bg-gray-100"
      >Get Started</a>
      </div>
    </section>
  </div>
</template>
<script setup>
import {
  onMounted,
  ref,
  onBeforeUnmount,
  defineAsyncComponent,
} from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

const heroSection = defineAsyncComponent(() => import('./hero.vue'));
const featuresSection = defineAsyncComponent(() => import('./features.vue'));

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
