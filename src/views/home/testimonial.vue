<template>
  <section class="bg-[#EDF5FF] font-alexandria pt-4 md:pt-10 pb-16">
      <div class="container flex justify-between items-end mx-auto
        w-[80%] pb-10 md:w-[70%] md:pb-20">
        <h3 class="testimonial-card text-4xl lg:text-5xl text-left text-[#3D3D3D]
          md:hidden font-bold">
          What Those <br /> Who Already<br /> Use It are Saying
        </h3>
        <h3 class="testimonial-card text-4xl lg:text-5xl text-left text-[#3D3D3D]
          hidden md:flex font-bold">
          What Those Who Already<br /> Use It are Saying
        </h3>
  <!-- BOTONES a la derecha y abajo -->
      <div class="testimonial-card flex flex-row items-end justify-end gap-4 hidden md:flex">
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
    <div class="container mx-auto w-[80%] md:w-[70%] overflow-hidden">
  <div id="testimonial-carrusel"
    class="flex content-center m-10 transition-transform duration-500 ease-in-out gap-40
           md:flex-row flex-col md:overflow-visible overflow-y-scroll
           md:h-auto mx-auto h-40 scroll-snap-y scroll-snap-mandatory">

    <!-- Testimonial 01 -->
    <div class="testimonial-card
      flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80
      md:w-80 w-full h-auto md:h-auto scroll-snap-start">
      <img src="/dgsky-comillas.svg" alt="comillas" class="w-10">
      <p class="pl-2 pt-2 leading-tight">
        "I used it once just to test,
        and ended up moving all my stuff in.
        It’s now my daily helper."</p>
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
    <div class="testimonial-card
      flex-shrink-0 flex flex-col text-md text-[#3d3d3d] font-semibold w-80
      md:w-80 w-full h-auto md:h-auto scroll-snap-start">
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

let currentIndex = 0;
const visibleCards = 3;
let carrusel = null;
let resizeObserver = null;

// Animaciones de entrada
onMounted(() => {
  gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      x: 100, // entra desde la derecha
      opacity: 0,
      duration: 1.2,
      delay: index * 0.2, // efecto en cascada
      ease: 'back.out(1.7)',
    });
  });
});

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

// Iniciar carrusel y observador de resize
onMounted(async () => {
  await nextTick();
  carrusel = document.getElementById('testimonial-carrusel');

  if (carrusel) {
    resizeObserver = new ResizeObserver(() => {
      updateCarrusel();
    });
    resizeObserver.observe(carrusel);
  }
});

// Limpiar referencias
onBeforeUnmount(() => {
  if (resizeObserver && carrusel) {
    resizeObserver.unobserve(carrusel);
    resizeObserver = null;
  }
  carrusel = null;
});
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

/* Carrusel sin scroll visible */
#testimonial-carrusel {
  overflow-x: hidden; /* evita que se vea la barra */
  display: flex;
  gap: 160px; /* mismo gap que usas en JS */
  scroll-behavior: smooth; /* movimiento suave si usas scroll */
}

#testimonial-carrusel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

#testimonial-carrusel {
  -ms-overflow-style: none;  /* IE y Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
