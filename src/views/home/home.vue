<template>
  <div>
    <!-- Hero Section -->
    <heroSection />
    <!-- Features Section -->
    <featuresSection />
    <!-- map Section -->
    <section class="bg-[#EDF5FF] pb-16">
      <div class="container flex justify-between items-center gap-x-8 mx-auto w-[75%]">
        <object
          id="Icons"
          aria-label="Icons SVG"
          type="image/svg+xml"
          data="dgsky-mapa.svg"
          class="w-72 md:w-80 lg:w-[700px] h-auto z-30"
          ></object>
      <div class="">
        <h2 class="text-5xl text-left text-[#3D3D3D] font-bold mb-10">
          Trusted by Thousands <br /> Worldwide
        </h2>

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
</div>
    </section>
    <!-- Users Section -->
    <section class="bg-[#EDF5FF] font-alexandria pb-20">
      <div class="container flex justify-between items-end mx-auto w-[70%]">
        <h3 class="text-5xl text-left text-[#3D3D3D] font-bold">
          What Those Who Already<br /> Use It are Saying
        </h3>
  <!-- BOTONES a la derecha y abajo -->
      <div class="flex flex-row items-end justify-end gap-4">
        <button @click="prev" class="btn-nav">
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2" />
          </svg>
        </button>
        <button @click="next" class="btn-nav">
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Testimonial Cards -->
    <div class="container mx-auto w-[70%] overflow-hidden">
    <div id="testimonial-carrusel"
      class="flex content-center
        m-10 transition-transform duration-500 ease-in-out gap-40"
      style="transform: translateX(0);">
    <!-- Testimonial 01 -->
      <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
    <!-- Testimonial 02 -->
    <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
    <!-- Testimonial 03 -->
    <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
      <!-- Testimonial 04 -->
      <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
      <!-- Testimonial 04 -->
      <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
      <!-- Testimonial 04 -->
      <div class="flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80">
        <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
        <p class="pl-2 pt-2 leading-tight">
          "I started using it for work,
          and now I store everything here.
          It just makes things easier."</p>
        <div class="flex flex-row items-center mt-4">
        <img src="/img01.jpg" alt="User Avatar"
          class="flex inline-block w-12 h-12 rounded-full border-2 border-[#0A77F3]">
        <div class="ml-4">
        <h3 class="text-xl text-[#0A77F3] font-bold -mb-2">John Doe</h3>
        <p class="text-lg text-[#797979] font-semibold -mt-2">Colombia</p>
        </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</div>
</template>
<script setup>
import {
  ref,
  defineAsyncComponent,
  onMounted,
} from 'vue';

let currentIndex = 0;
const visibleCards = 3;
let carrusel = null;

function updateCarrusel() {
  if (!carrusel) return;

  const card = carrusel.children[0];
  const gap = 160;
  const cardWidth = card.offsetWidth + gap;
  const offset = currentIndex * cardWidth;
  carrusel.style.transform = `translateX(-${offset}px)`;
}

function prev() {
  if (!carrusel) return;

  if (currentIndex > 0) {
    currentIndex -= 1;
    updateCarrusel();
  } else {
    console.log('No more previous cards');
  }
}

function next() {
  if (!carrusel) return;

  if (currentIndex < carrusel.children.length - visibleCards) {
    currentIndex += 1;
    updateCarrusel();
  } else {
    console.log('No more next cards');
  }
}

onMounted(() => {
  carrusel = document.getElementById('testimonial-carrusel');
});

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
