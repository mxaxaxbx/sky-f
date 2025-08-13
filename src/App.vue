<template>
  <div class="bg-[#EDF5FF]">
    <Notifications />
    <!-- Dark overlay -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black opacity-50 z-30"
      @click="toggleSidebar"
      @keydown="toggleSidebar"
    ></div>
    <!-- menu -->
    <div
      v-click-outside="clickOutside"
      class="
        w-full fixed
        z-40
        -mt-2
        mb-8
      "
    >
      <NavBar/>
      <!-- sidebar -->
      <Sidebar />
    </div>
    <!-- content -->
    <div
      class="pt-16"
      :class="{
        'blocker': showSidebar,
      }"
    >
      <router-view />
    </div>
    <!-- footer -->
    <footer
      id="footer"
      class="bg-[#0A77F3]
        text-white font-alexandria
        p-20 overflow-hidden">
      <div class="container flex flex-row w-[75%] mx-auto">
        <!--div azul-->
        <div class="flex-1 flex flex-col pt-4">
          <img src="/dgsky-logo-white.svg" alt="sky logo" class="w-24 mb-4">
          <p class="text-lg font-semibold">A digital experience from Digi Apps. </p>
          <p class="text-md font-light mb-10">Simple. Safe. Always with you.</p>
          <p clas="text-sm font-light">&copy; 2024 digi-storage. Alll rights reserved.</p>
        </div>
        <!--div rojo-->
        <div class="flex-1 mx-auto pt-8 px-4 flex flex-row gap-24">
        <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Products</h3>
        <ul class="space-y-2 text-white/70 text-sm">
          <li><a
            href="#"
            class="hover:text-white/100 hover:font-semibold">Sky</a></li>
          <li><a
            href="#"
            class="hover:text-white/100 hover:font-semibold">Fireweb</a></li>
          <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">DigiCare</a></li>
        </ul>
        </div>
      <!-- Help -->
    <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Help</h3>
        <ul class="space-y-2 text-white/70 text-sm">
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Help Center</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Contact Us</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Vulnerability Reward Programme</a></li>
      </ul>
    </div>
    <!-- Legal -->
    <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Legal</h3>
        <ul class="space-y-2 text-white/70 text-sm">
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Terms of Service</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Privacy Policy</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Transparency Report</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Copyright Notice</a></li>
        <li><a
        href="#"
          class="hover:text-white/100 hover:font-semibold">Submission</a></li>
      </ul>
    </div>
    </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

onMounted((): void => {
  gsap.registerPlugin(ScrollTrigger);

  // Estado inicial del fondo (cerrado)
  gsap.set('#footer', { clipPath: 'inset(100% 0% 0% 0%)' });

  // Línea de tiempo
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  });

  // 1) Despliegue del fondo
  tl.to('#footer', {
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.2,
    ease: 'power3.out',
  });

  // 2) Logo
  tl.from('#footer img', {
    y: 40,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    delay: -0.09,
  }); // empieza antes de que termine el fondo

  // 3) Texto bajo el logo
  tl.from('#footer .flex-1.flex.flex-col p', {
    y: 20,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.04,
  });

  // 4) Mapa de sitio (tres columnas)
  tl.from('#footer .mx-auto.pt-8 > div', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.0,
  }, '-=1.1');
});

const NavBar = defineAsyncComponent(() => import('./components/global/nav-bar.vue'));
const Sidebar = defineAsyncComponent(() => import('@/components/global/sidebar.vue'));
const Notifications = defineAsyncComponent(() => import('@/components/global/notifications.vue'));

const store = useStore();

const showSidebar = computed(() => store.state.sidebar);

function clickOutside() {
  if (showSidebar.value) store.commit('toggleSidebar');
}

function toggleSidebar() {
  store.commit('toggleSidebar');
}

</script>

<style scoped>
.blocker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.9); /* Change the alpha value for darkness */
  z-index: 20; /* Ensure it's above the sidebar */
}
</style>
