<template>
  <nav :class="[
    'relative flex items-center justify-between',
    'bg-white',
    'w-full h-16',
    'py-2 px-8',
    'border-b border-[#9DC9FA]',
    'transition-all duration-200 ease-in-out origin-center',
    'hidden lg:flex',
    isAuth ? 'fixed' : '',
    isSticky || isAuth
      ? 'top-0 left-0 right-0 px-6 max-w-full rounded-none'
      : 'w-[55%] max-w-6xl mx-auto rounded-full border-none',
    isRising && !isAuth
      ? 'mt-2'
      : !isAuth ? 'mt-8' : '',
    isSticky || isAuth ? 'w-full flex justify-between items-center relative mx-auto' : '',
  ]">
    <!-- LOGO animado -->
    <router-link
      :to="isAuth ? '/app' : '/'"
      class="absolute left-1/2 -translate-x-1/2 animate-moveLogo"
    >
      <img
        src="/icon/icon-logoSky.svg"
        alt="logo"
        class="
          h-[25px] ml-8
          cursor-pointer
          ">
    </router-link>
    <!-- Centro -->
     <!-- search box -->
     <div class="absolute left-1/2 -translate-x-1/2 flex items-center w-[600px] mt-2 h-16">
        <label for="search" class="text-[#a3a3a3] hidden"></label>

        <!-- Contenedor relativo -->
        <div class="relative w-full">
          <!-- Input -->
          <input
            type="text"
            placeholder="Search everything"
            class="
              w-full
              border border-[#0B77F3]/50
              rounded-full font-light
              pl-12 pr-4 py-1
              hover:border-[#0A77F3]
              focus:ring-1 focus:ring-[#0A77F3]
              focus:outline-none
              transition-all duration-300
            "
          />

          <!-- Ícono dentro del input -->
          <img
            src="/icon/icon-search.svg"
            alt="Search Icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-6pointer-events-none"
          />
        </div>
      </div>
    <div
      v-if="!isAuth"
      class="absolute left-1/2 -translate-x-1/2 flex items-center">
      <div
        class="w-px h-6 bg-blue-300 mx-16 animate-fade-in-up"
        style="animation-delay: 0.70s"
      ></div>

      <div class="flex items-center gap-16 text-gray-500 font-semibold text-md">
        <a
          href="#features"
          class="nav-link animate-fade-in-up"
          style="animation-delay: 0.80s"
        >Features</a>

        <a
          href="#plans"
          class="nav-link animate-fade-in-up"
          style="animation-delay: 0.90s"
        >Plans</a>

        <a
          href="#services"
          class="nav-link animate-fade-in-up"
          style="animation-delay: 1.0s"
        >Services</a>
      </div>

      <div
        class="w-px h-6 bg-blue-300 mx-16 animate-fade-in-up"
        style="animation-delay: 0.70s"
      ></div>
    </div>

    <!-- REGISTER + USER -->
    <div class="flex items-center gap-4 ml-auto mr-2 opacity-0 animate-showButtons">
      <a
        v-if="!isAuth"
        :href="usersLink"
        class="
          block
          border border-[#0A77F3]
          text-lg text-[#0A77F3] font-semibold
          h-10
          px-8 py-1
          rounded-full
          hover:bg-[#0A77F3] hover:text-white transition-all
        ">
        Register
      </a>

      <Dropdown v-if="isAuth">
          <template #trigger="{ toggle }">
            <button
              @click="toggle"
              class="
                relative
                flex items-center justify-center
                bg-[#0B77F3]
                rounded-full
                text-white
                h-8
                w-8
                hover:ring-4 hover:ring-[#0B77F3]/50
                focus:ring-4 focus:ring-[#0B77F3]/50
                transition-all duration-300 ease-in-out
              "
            >
            <!-- User initials -->
            <span
              v-if="!user.profilePhoto && user.firstName && user.lastName"
              class="font-thin text-sm uppercase"
            >
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </span>

            <!-- Profile photo -->
            <img
              v-else-if="user.profilePhoto"
              :src="user.profilePhoto"
              alt="User profile photo"
              class="h-8 rounded-full object-cover"
            />

            <!-- Fallback icon -->
            <i
              v-else
              class="fas fa-user text-white text-sm"
              aria-hidden="true"
            ></i>

              <!-- Optional status indicator -->
              <span
                class="
                  absolute
                  bottom-0 right-[-2px]
                  block
                  h-[12px] w-[12px]
                  rounded-full
                  bg-green-500
                  border-2 border-white
                "
              ></span>
            </button>
          </template>

          <template #content="{}">
            <!-- Avatar, email, user name -->
            <div class="flex flex-col items-center mb-10">
              <div class="relative --w-16 --h-16">
                <img
                  :src="user.profilePhoto || '/img/user.svg'"
                  alt="Avatar"
                  class="
                    rounded-full
                    w-20 h-20
                    border-2 border-[#9DC9FA]
                    object-cover border"
                />
              </div>

              <h2 class="mt-4 text-lg font-bold text-[#3d3d3d]">¡Hi,
                {{ user.firstName }} {{ user.lastName }}!
              </h2>

              <!-- Email -->
              <div class="text-center mt-0">
                <p class="text-[#A3A3A3] text-xs font-thin">
                  {{ user.email }}
                </p>
              </div>

              <!-- Manage Account Button -->
              <a
                :href="`${usersLink}/app/users/edit-profile`"
                class="
                  bg-[#ffffff]
                  w-60
                  px-auto py-[10px] mt-6
                  border border-[#0A77F3]/50 rounded-full
                  text-[#0A77F3] text-xs font-medium text-center
                  hover:bg-[#0A77F3] hover:text-white
                  transition ease-in duration-150
                "
                target="_blank"
              >
                Manage your digi Account
              </a>
            </div>

            <div class="flex flex-col items-start mx-8 mb-6">
              <!-- community -->
              <h1 class="text-xs font-regular ml-4 text-[#3d3d3d] mb-2">Community</h1>

              <a
                href="https://discord.com/invite/UsGXbTkJSE"
                target="_blank"
                class="
                  flex items-center justify-between
                  w-60 px-4 py-2
                  rounded-full border border-[#7DBAFF]
                  bg-[#EDF5FF] text-[#3d3d3d]
                  font-medium text-sm
                  transition-all duration-300
                  hover:border-[#0A77F3] hover:bg-[#0A77F3]/15
                "
              >
                <div class="flex items-center gap-2">
                  <img
                    src="/icon/icon-discordd.svg"
                    alt="Discord"
                    class="h-4 mx-1"
                  />
                  <span>Discord</span>
                </div>
                <img
                  src="/icon/icon-outPage.svg"
                  alt="External link"
                  class="w-[20px]"
                />
              </a>
            </div>
            <div class="flex flex-col items-start mx-8 mb-6">
              <!-- Support -->
              <h1 class="text-xs font-regular ml-4 text-[#3d3d3d] mb-2">Support</h1>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
                target="_blank"
                class="
                  flex items-center justify-between
                  w-60 px-4 py-2
                  rounded-full border border-[#7DBAFF]
                  bg-[#EDF5FF] text-[#3d3d3d]
                  font-medium text-sm
                  transition-all duration-300
                  hover:border-[#0A77F3] hover:bg-[#0A77F3]/15
                "
              >
                <div class="flex items-center gap-2">
                  <img
                    src="/icon/icon-mail.svg"
                    alt="mail"
                    class="h-4 mx-1"
                  />
                  <span>support@digiapps.com.co</span>
                </div>
              </a>
            </div>

            <!-- Actions -->
            <div class="flex flex-col items-center space-y-2 mt-12">
              <button
                @click="logout"
                class="
                  flex items-center justify-around
                  bg-[#0A77F3]
                  w-44
                  rounded-full
                  px-4 py-2
                  text-sm text-white font-regular
                  hover:ring-4 hover:ring-[#0A77F3]/50
                  transition-all duration-300 ease-in-out

                "
              >
                <span class="flex items-center space-x-2">
                  <span>Sign out</span>
                  <img src="/icon/icon-logOut.svg"
                  alt="icon"
                  class="ml-2 w-[20px]"/>
                </span>
              </button>
            </div>

            <!-- Footer -->
            <div
              class="flex justify-around mt-8 text-[10px] text-[#3d3d3d] px-16"
            >
              <a
              :href="`${usersLink}/privacy-policy`"
              target="_blank"
              class="hover:underline hover:text-[#bebebe]"
              >
                Terms of Service</a>
                <span>•</span>
              <a
                :href="`${usersLink}/privacy-policy`"
                target="_blank"
                class="hover:underline hover:text-[#bebebe]"
              >
                Privacy Policy
              </a>
            </div>
          </template>
        </Dropdown>
      <div v-else>
        <a :href="`${usersLink}/auth/login?app=care`" aria-label="User Profile">
          <i class="fas fa-user" aria-hidden="true"></i>
          <span class="sr-only">User Profile</span>
        </a>
      </div>
    </div>
  </nav>
  <!-- Navbar Mobile & Tablet -->
  <nav class="fixed flex w-full items-center justify-between
  px-4 sm:px-6 h-16 bg-white lg:hidden relative z-50">
    <!-- LOGO izquierda -->
    <router-link :to="isAuth ? '/app' : '/'" class="flex items-center">
      <img src="dgsky-logo.svg" alt="logo" class="w-16 sm:w-20 pt-2">
    </router-link>

    <!-- Botón hamburguesa derecha -->
    <button @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="text-[#3D3D3D] mt-2 focus:outline-none hover:text-[#0A77F3] transition-colors"
      :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="isMobileMenuOpen">
      <i class="fas fa-bars text-2xl sm:text-3xl"></i>
    </button>

    <!-- Menú desplegable -->
    <transition name="slide-left">
      <div
        v-if="isMobileMenuOpen"
        class="
          menu-open fixed bg-white
          absolute top-0 text-center left-0 w-full h-[calc(100vh+1rem)]
          shadow-lg flex flex-col p-4 sm:p-6 gap-4 z-40 overflow-y-auto
        "
      >
        <button
          class="
            absolute top-4 sm:top-6 right-4 sm:right-6
            text-2xl sm:text-3xl text-[#3D3D3D] font-bold
            hover:text-[#0A77F3] transition-colors focus:outline-none
          "
          @click="isMobileMenuOpen = false"
          aria-label="Close menu"
        >
          <i class="fas fa-xmark"></i>
        </button>
        <!-- Icono de usuario -->
        <div v-if="isAuth" class="mt-8 sm:mt-12">
          <Dropdown
            :content="dropdownContent"
            :options="dropdownOptions"
            :loading="loading"
            @action="handleAction"
          />
        </div>
        <div v-else class="bg-[#0A77F3] mt-12 sm:mt-16 rounded-full
          w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center
          mx-auto text-white text-3xl sm:text-4xl hover:bg-[#0a66d4] transition-colors">
          <a :href="usersLink" aria-label="User Profile"><i class="py-6 fas fa-user"></i></a>
        </div>
        <h1 class="text-xl sm:text-2xl text-[#3D3D3D] font-bold mt-4">Hi, Welcome to Sky!</h1>

        <!-- Botón Register -->
        <a :href="usersLink" class="border border-[#0A77F3] text-[#0A77F3] font-semibold
          h-10 py-2 w-[70%] sm:w-[60%] rounded-full mx-auto
          flex items-center justify-center hover:bg-[#0A77F3]
          hover:text-white transition-all mt-2 sm:mt-4">
          Register
        </a>

        <!-- Menu links -->
        <div class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-3xl
              mx-auto mt-6 sm:mt-8 w-[94%] sm:w-[90%] max-w-md">
          <a
            href="#features"
            @click="isMobileMenuOpen = false"
            class="
              border-b-4 py-4 pl-8 sm:pl-10 w-full border-white
              font-bold hover:bg-[#d6e9ff] transition-colors hover:text-[#0A77F3]
            "
          >
            <i class="fa-solid fa-rectangle-list pr-4 text-lg sm:text-xl"></i>
            Features</a>
          <a
            href="#plans"
            @click="isMobileMenuOpen = false"
            class="
              border-b-4 py-4 pl-8 sm:pl-10 w-full border-white
              font-bold hover:bg-[#d6e9ff] transition-colors hover:text-[#0A77F3]
            "
          >
            <i class="fa-solid fa-tags pr-4 text-lg sm:text-xl"></i>Plans</a>
          <a
            href="#services"
            @click="isMobileMenuOpen = false"
            class="
              py-4 pl-8 sm:pl-10 w-full font-bold hover:bg-[#d6e9ff]
              transition-colors hover:text-[#0A77F3]
            "
          >
            <i class="fa-solid fa-suitcase pr-4 text-lg sm:text-xl"></i>
            Services</a>
        </div>
        <div class="w-[94%] sm:w-[90%] max-w-md mx-auto">
          <p
            class="text-left text-gray-400 text-sm sm:text-base pl-4 sm:pl-8 pt-6 pb-2"
          >Community</p>
          <div class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-full
              mx-auto mt-0 w-full">
            <a href="https://discord.com/invite/UsGXbTkJSE" @click="isMobileMenuOpen = false" class="flex justify-between items-center font-bold py-4
            pl-8 sm:pl-10 w-full hover:bg-[#d6e9ff]
            transition-colors hover:text-[#0A77F3]" target="_blank" rel="noopener noreferrer">
              <span>
                <i class="fa-brands fa-discord pr-4 text-lg sm:text-xl"></i>Discord
              </span>
              <i class="fa-solid fa-arrow-up-right-from-square text-sm mr-6 sm:mr-10"></i>
            </a>
          </div>
        </div>
        <div class="w-[94%] sm:w-[90%] max-w-md mx-auto">
          <p class="text-left text-sm sm:text-base text-gray-400 pl-4 sm:pl-8 pt-6 pb-2">Support</p>
          <div class="flex flex-col bg-[#EDF5FF]
              text-left text-[#3D3D3D] rounded-full
              mx-auto mt-0 w-full">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
              @click="isMobileMenuOpen = false"
              class="
                flex font-bold py-4 pl-8 sm:pl-10 w-full
                hover:bg-[#d6e9ff] transition-colors hover:text-[#0A77F3]
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fa-solid fa-envelope pr-4 text-lg sm:text-xl"></i>
              <span class="text-sm sm:text-base">support@digiapps.com.co</span>
            </a>
          </div>
        </div>
        <div class="w-full text-gray-400
        flex flex-col sm:flex-row justify-center mb-4 items-center
        gap-2 sm:gap-4 mx-auto mt-auto pb-4">
          <a href="https://www.digiapps.com.co/privacy-policy" target="_blank" rel="noopener noreferrer"
            @click="isMobileMenuOpen = false" class="font-regular text-xs sm:text-sm mt-2 sm:mt-4
            hover:text-gray-600 transition-colors">
            Terms of Service</a>
          <span class="hidden sm:inline mt-4">&bull;</span>
          <a href="https://www.digiapps.com.co/privacy-policy" target="_blank" rel="noopener noreferrer"
            @click="isMobileMenuOpen = false" class="font-regular text-xs sm:text-sm mt-2 sm:mt-4
            hover:text-gray-600 transition-colors">
            Privacy Policy
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

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

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

let scrollHandler: (() => void) | null = null;

onMounted(() => {
  scrollHandler = () => {
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
  };

  window.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }
});

const store = useStore();

const loading = ref<boolean>(false);

const { VUE_APP_DG_USERS_APP } = process.env;

const usersLink = ref(`${VUE_APP_DG_USERS_APP}/auth/login?app=sky`);

const isAuth = computed(() => store.getters['auth/isAuth']);
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

function logout() {
  store.dispatch('auth/logout');
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
    transform: translate3d(100px, 100px, 0);
    /* desde abajo a la derecha */
    blur: 100px;
    /* desenfoque inicial */
  }

  60% {
    opacity: 1;
    transform: translate3d(-10px, -10px, 0);
    /* ligeramente más allá para efecto bounce */
    blur: 10px;
    /* desenfoque eliminado */
  }

  80% {
    transform: translate3d(5px, 5px, 0);
    /* rebote hacia atrás */
    blur: 0;
    /* desenfoque eliminado */
  }

  100% {
    transform: translate3d(0, 0, 0);
    /* posición final */
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
  top: 90%;
  /* se acerca pero no toca el texto */
  transform: translateX(-50%) scale(1);
  opacity: 1;
}

.nav-link:hover {
  color: #0A77F3;
  /* cambia el color del texto */
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
