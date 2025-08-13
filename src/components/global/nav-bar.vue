<template>
  <nav
  :class="[
    'h-14 bg-white py-2 flex items-center justify-between',
    'relative font-alexandria overflow-hidden',
    'transition-all duration-200 ease-in-out origin-center',
    'hidden md:flex',
    isSticky
      ? 'top-0 left-0 right-0 z-50 px-6 max-w-full rounded-none'
      : 'w-[55%] max-w-6xl mx-auto rounded-full',
    isRising
      ? 'mt-2'
      : 'mt-8',
    isSticky ? 'w-full flex justify-between items center relative mx-auto' : ''
  ]"
>
 <!-- LOGO animado -->
    <router-link
      :to="isAuthenticated ? '/app' : '/'"
      class="absolute left-1/2 -translate-x-1/2 animate-moveLogo"
    >
      <img
        src="dgsky-logo.svg"
        alt="logo"
        class="w-20 ml-6"
      >
    </router-link>

    <!-- Centro -->
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center">
  <div class="w-px h-6 bg-blue-300 mx-16 animate-fade-in-up"
       style="animation-delay: 0.70s"></div>

  <div class="flex items-center gap-16 text-gray-500 font-semibold text-md">
    <a href="#features"
       class="nav-link animate-fade-in-up"
       style="animation-delay: 0.80s"
    >Features</a>

    <a href="#plans"
       class="nav-link animate-fade-in-up"
       style="animation-delay: 0.90s"
    >Plans</a>

    <a href="#services"
       class="nav-link animate-fade-in-up"
       style="animation-delay: 1.0s"
    >Services</a>
  </div>

  <div class="w-px h-6 bg-blue-300 mx-16 animate-fade-in-up"
       style="animation-delay: 0.70s"></div>
</div>

    <!-- REGISTER + USER -->
    <div class="flex items-center gap-4 ml-auto mr-2 opacity-0 animate-showButtons">
      <button
        class="border border-[#0A77F3] text-lg text-[#0A77F3] font-semibold h-10 px-8
               rounded-full hover:bg-[#0A77F3] hover:text-white transition-all"
      >
        Register
      </button>

      <Dropdown
        v-if="isAuthenticated"
        :content="dropdownContent"
        :options="dropdownOptions"
        :loading="loading"
        @action="handleAction"
      />
      <div
        v-else
        class="bg-[#0A77f3] border border-[#0A77F3] rounded-full
          flex justify-center items-center
          text-white
          w-10 h-10
          hover:bg-white hover:text-[#0a77f3] transition-all"
      >
        <a
          :href="usersLink" aria-label="User Profile">
          <i class="fas fa-user text-lg"
              aria-hidden="true"></i>
          <span class="sr-only">User Profile</span>
        </a>
      </div>
    </div>
  </nav>
  <!-- Navbar Mobile -->
<nav class="fixed flex w-full items-center justify-between
  px-6 h-16 bg-white md:hidden relative">
  <!-- LOGO izquierda -->
  <router-link :to="isAuthenticated ? '/app' : '/'" class="flex items-center">
    <img src="dgsky-logo.svg" alt="logo" class="w-16 pt-2">
  </router-link>

  <!-- Botón hamburguesa derecha -->
  <button @click="isMobileMenuOpen = !isMobileMenuOpen"
    class="text-[#3D3D3D] mt-2 focus:outline-none">
    <i class="fas fa-bars text-2xl"></i>
  </button>

  <!-- Menú desplegable -->
  <transition name="slide-left">
    <div v-if="isMobileMenuOpen"
      class="menu-open fixed bg-white absolute top-0 text-center left-0 w-full h-[calc(100vh+1rem)]
      shadow-lg flex flex-col p-4 gap-4 z-40 overflow-y-auto">
        <button
          class="absolute top-6 right-6 text-3xl text-[#3D3D3D] font-bold"
          @click="isMobileMenuOpen = false"
        >
        <i class="fas fa-xmark"></i>
    </button>
      <!-- 1️⃣ Icono de usuario -->
      <div v-if="isAuthenticated">
        <Dropdown :content="dropdownContent" :options="dropdownOptions"
                  :loading="loading" @action="handleAction" />
      </div>
      <div v-else class="bg-[#0A77F3] mt-16 rounded-full
          w-20 h-20 flex justify-center items-center
          mx-auto text-white text-3xl">
        <a :href="usersLink" aria-label="User Profile"><i class="fas fa-user"></i></a>
      </div>
      <h1 class="text-xl text-[#3D3D3D] font-bold">Hi, Welcome to Sky!</h1>

      <!-- 3️⃣ Botón Register -->
      <button class="border border-[#0A77F3] text-[#0A77F3] font-semibold
          h-10 w-[70%] rounded-full mx-auto ">
        Register
      </button>

      <!-- 2️⃣ Menu links -->
      <div
        class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-3xl
              mx-auto mt-8 w-[94%]">
        <a href="#features" class="border-b-4 py-4 pl-10 w-full border-white font-bold">
          <i class="fa-solid fa-rectangle-list pr-4 text-xl"></i>Features</a>
        <a href="#plans" class="border-b-4 py-4 pl-10 w-full border-white font-bold">
          <i class="fa-solid fa-tags pr-4 text-xl"></i>Plans</a>
        <a href="#services" class="py-4 pl-10 w-full font-bold">
          <i class="fa-solid fa-suitcase pr-4 text-xl"></i>Services</a>
      </div>
      <div>
      <p class="text-left text-gray-400 text-sm pl-8 pt-6 pb-2">Community</p>
      <div
        class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-full
              mx-auto mt-0 w-[94%]">
        <a href="https://discord.com/invite/UsGXbTkJSE"
          class="flex justify-between items-center font-bold py-4 pl-10 w-full"
          target="_blank">
          <span>
            <i class="fa-brands fa-discord pr-4 text-xl"></i>Discord
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square text-sm mr-10"></i>
        </a>
      </div>
      </div>
      <div>
      <p class="text-left text-sm text-gray-400 pl-8 pt-6 pb-2">Support</p>
      <div
        class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-full
              mx-auto mt-0 w-[94%]">
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
          class="flex font-bold py-4 pl-10 w-full"
          target="_blank">
          <i class="fa-solid fa-envelope pr-4 text-xl"></i>support@digiapps.com.co</a>
        </div>
      </div>
      <div class="w-full text-gray-400
        flex justify-center mb-4 items-center gap-4 mx-auto mt-auto">
        <a
          href="https://www.digiapps.com.co/privacy-policy"
          target="_blank"
          class="font-regular text-sm mt-4">Terms of Service</a>
          <span class="mt-4">&bull;</span>
        <a
          href="https://www.digiapps.com.co/privacy-policy"
          target="_blank"
          class="font-regular text-sm mt-4">Privacy Policy
        </a>
      </div>
    </div>
  </transition>
</nav>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  defineAsyncComponent,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { useStore } from 'vuex';

import { UserI } from '@/store/auth/state';
import { OptionI } from '@/store/state';

const isMobileMenuOpen = ref(false);

watch(isMobileMenuOpen, (open) => {
  if (open) {
    document.documentElement.style.overflow = 'hidden'; // bloquea html
    document.body.style.overflow = 'hidden'; // bloquea body
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
});

const isSticky = ref(false);
const isRising = ref(false);

onMounted(() => {
  window.addEventListener('scroll', () => {
    const { scrollY } = window;

    if (scrollY > 50 && !isSticky.value) {
      isRising.value = true;
      setTimeout(() => {
        isSticky.value = true;
      }, 300); // primero sube, luego expande
    }

    if (scrollY <= 50 && isSticky.value) {
      isSticky.value = false;
      setTimeout(() => {
        isRising.value = false;
      }, 350); // vuelve al estado original más tarde
    }
  });
});

// aqui

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const store = useStore();

const loading = ref<boolean>(false);

const { VUE_APP_DIGI_USERS_F } = process.env;

const usersLink = ref(`${VUE_APP_DIGI_USERS_F}/auth/login?app=storage`);

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
const user = computed<UserI>(() => store.getters['auth/user']);

const dropdownContent = ref<string>(user.value ? `
  <span>
    ${user.value.firstName.charAt(0)}
    ${user.value.lastName.charAt(0)}
  </span>
` : `
  <i class="fas fa-user" aria-hidden="true"></i>
  <span class="sr-only">User Profile</span>
`);

const dropdownOptions: OptionI[] = [
  { content: 'cerrar sesión', action: 'logout' },
];

function handleAction(action: string) {
  if (action === 'logout') {
    store.dispatch('auth/logout');
  }
}

function toggleSidebar() {
  store.commit('toggleSidebar');
}

</script>
<style scoped>
.animate-fade-in-up {
  animation: fadeInBounce 0.7s ease-out both;
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

@keyframes fadeInBounce {
  0% {
    opacity: 0;
    transform: translate3d(100px, 100px, 0); /* desde abajo a la derecha */
    blur: 100px; /* desenfoque inicial */
  }
  60% {
    opacity: 1;
    transform: translate3d(-10px, -10px, 0); /* ligeramente más allá para efecto bounce */
    blur: 10px; /* desenfoque eliminado */
  }
  80% {
    transform: translate3d(5px, 5px, 0); /* rebote hacia atrás */
    blur: 0; /* desenfoque eliminado */
  }
  100% {
    transform: translate3d(0, 0, 0); /* posición final */
  }
}

/* Accesibilidad: sin animación si el usuario la prefiere reducida */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* clase base para cada link */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) scale(0.3);
  width: 120%;
  height: 300%;
  background: radial-gradient(circle, rgba(157, 201, 250, 1), white 70%);
  opacity: 0;
  pointer-events: none;
}

.nav-link:hover::after {
  top: 90%; /* se acerca pero no toca el texto */
  transform: translateX(-50%) scale(1);
  opacity: 1;
}
.nav-link:hover {
  color: #0A77F3; /* cambia el color del texto */
}

.slide-left-enter-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 1;
}
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
body.menu-open {
  overflow: hidden;
}
</style>
