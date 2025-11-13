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
        z-50
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
      class="
        min-h-[96vh 6rem]
        z-40
        font-alexandria
      "
      :class="{
        'blocker': showSidebar,
      }"
    >
      <router-view />
    </div>
    <!-- footer -->
    <footer id="footer"
      v-if="isAuth"
      class="bg-[#0A77F3] text-white font-alexandria pt-8 px-6 pb-10 md:p-20 overflow-hidden">
        <div class="container w-[100%] md:w-[75%] mx-auto
        flex flex-col md:flex-row h-full md:h-auto">
          <!--Logo-->
          <div
            class="flex-1 flex flex-col items-center text-center pt-8 md:pt-4
              order-2 md:order-none md:items-start md:text-left gap-2">
            <img src="/dgsky-logo-white.svg" alt="sky logo" class="w-24 mb-4">
            <p class="text-md md:text-lg font-bold md:font-semibold">
              A digital experience from Digi Apps.
            </p>
            <p class="text-md md:text-md font-light">Simple. Safe. Always with you.</p>
            <p class="text-xs font-light mt-16">
              &copy; 2024 sky. All rights reserved.</p>
          </div>
        <div class="flex-1 pt-8 px-1 flex flex-col
        md:flex-row md:gap-24 mb-20 md:mb-1 md:mx-auto">
          <!--Products-->
            <div class="flex-1 footer-col border-t border-b border-white/20 md:border-white/0">
              <button class="w-full flex justify-between items-center text-left md:hidden"
                @click="toggleFooter('products')">
                <h3 class="text-lg my-4 font-bold">Products</h3>
                <span class="text-xl font-bold">
                  {{ openFooter.includes('products') ? '-' : '+' }}
                </span>
              </button>
             <h3 class="hidden md:block text-md font-bold mb-4">Products</h3>

            <ul class="overflow-hidden transition-all duration-300 ease-in-out
                      space-y-4 text-white/70 text-sm pl-4 md:pl-1
                      md:max-h-none md:opacity-100 md:overflow-visible md:transition-none"
                :class="openFooter.includes('products')
                  ? 'max-h-100 opacity-100'
                  : 'max-h-0 opacity-0'">
                  <li><a href="#" class="hover:text-white/100 hover:font-semibold">Sky</a></li>
                  <li>
                    <a
                      href="https://fireweb.digiapps.com.co/"
                      target="_blank"
                      class="hover:text-white/100 hover:font-semibold">Fireweb</a></li>
                  <li><a href="#" class="hover:text-white/100 hover:font-semibold">DigiCare</a></li>
                  <br>
                </ul>
            </div>
          <!-- Help -->
          <div class="flex-1 footer-col border-b border-white/20 md:border-white/0">
              <button class="w-full flex justify-between items-center text-left md:hidden"
                @click="toggleFooter('help')">
                <h3 class="text-lg my-4 font-bold">Help</h3>
                <span class="text-xl font-bold">
                  {{ openFooter.includes('help') ? '-' : '+' }}
                </span>
              </button>
             <h3 class="hidden md:block text-md font-bold mb-4">Help</h3>

            <ul class="overflow-hidden transition-all duration-300 ease-in-out
                      space-y-4 text-white/70 text-sm pl-4 md:pl-1
                      md:max-h-none md:opacity-100 md:overflow-visible md:transition-none"
                :class="openFooter.includes('help')
                  ? 'max-h-100 opacity-100'
                  : 'max-h-0 opacity-0'">
                  <li>
                    <a href="#"
                      class="hover:text-white/100 hover:font-semibold">Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#"
                      class="hover:text-white/100 hover:font-semibold">Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#"
                      class="hover:text-white/100 hover:font-semibold">
                      Vulnerability Reward Programme
                    </a>
                  </li>
                  <br>
                </ul>
          </div>
          <!-- Legal -->
          <div class="flex-1 footer-col border-b border-white/20 md:border-white/0">
              <button class="w-full flex justify-between items-center text-left md:hidden"
                @click="toggleFooter('legal')">
                <h3 class="text-lg my-4 font-bold">Legal</h3>
                <span class="text-xl font-bold">
                  {{ openFooter.includes('legal') ? '-' : '+' }}
                </span>
              </button>
             <h3 class="hidden md:block text-md font-bold mb-4">Legal</h3>

            <ul class="overflow-hidden transition-all duration-300 ease-in-out
                      space-y-4 text-white/70 text-sm pl-4 md:pl-1
                      md:max-h-none md:opacity-100 md:overflow-visible md:transition-none"
                :class="openFooter.includes('legal')
                  ? 'max-h-100 opacity-100'
                  : 'max-h-0 opacity-0'">
              <li>
                <a href="#"
                  class="hover:text-white/100 hover:font-semibold">Terms of Service</a></li>
              <li>
                <a href="#"
                  class="hover:text-white/100 hover:font-semibold">Privacy Policy</a></li>
              <li>
                <a href="#"
                  class="hover:text-white/100 hover:font-semibold">Transparency Report</a></li>
              <li>
                <a href="#"
                  class="hover:text-white/100 hover:font-semibold">Copyright Notice</a></li>
              <li>
                <a href="#"
                  class="hover:text-white/100 hover:font-semibold">Submission</a></li>
            <br>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  computed,
  onMounted,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const openFooter = ref<string[]>([]);

function toggleFooter(item: string) {
  if (openFooter.value.includes(item)) {
    // si ya está abierto, lo quitamos
    openFooter.value = openFooter.value.filter((i) => i !== item);
  } else {
    // si no está abierto, lo agregamos
    openFooter.value.push(item);
  }
}
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
    duration: 0.5,
    ease: 'power2.out',
    delay: 0.0,
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
  tl.from('#footer .footer-col .mx-auto.pt-8 > div', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.1,
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
  /* z-index: 20; Ensure it's above the sidebar */
}
</style>
