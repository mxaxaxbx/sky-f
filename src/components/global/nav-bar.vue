<template>
  <nav :class="[
    'relative flex items-center justify-between',
    'bg-white',
    'font-alexandria',
    'w-full h-12',
    'px-2',
    'border-b border-[#9DC9FA]',
    'transition-all duration-200 ease-in-out origin-center',
    'lg:flex',
    isAuth ? 'fixed' : '',
    isSticky || isAuth
      ? 'top-0 left-0 right-0 px-4 my-2 h-16 max-w-full rounded-none'
      : 'w-[55%] max-w-6xl mx-auto rounded-full border-none',
    isRising && !isAuth
      ? 'mt-2'
      : !isAuth ? 'mt-8' : '',
    isSticky || isAuth ? 'w-full flex justify-between items-center mx-auto' : '',
  ]">
    <!-- LOGO animado -->
    <router-link
      :to="isAuth ? '/app' : '/'"
      class="absolute left-1/2 -translate-x-1/2 animate-moveLogo"
    >
      <img src="/icon/icon-logoSky.svg" alt="logo" class="
          h-[25px] ml-2 sm:ml-6
          cursor-pointer
          ">
    </router-link>
    <!-- Centro -->
    <!-- search box -->
    <div v-if="isAuth" class="
        absolute left-1/2 -translate-x-1/2 flex items-center
        w-[600px] h-16
        hidden lg:flex
        ">
      <label for="search" class="text-[#a3a3a3] hidden"></label>

      <!-- Contenedor relativo -->
      <form @submit.prevent="handleSearch" class="relative w-full">
        <!-- Input -->
        <input
          v-model="pagination.query"
          @input="handleInput"
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
        <img src="/icon/icon-search.svg" alt="Search Icon"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-6 pointer-events-none" />
        {{ pagination }}
      </form>
    </div>
    <div v-if="!isAuth" class="absolute left-1/2 -translate-x-1/2 flex items-center">
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
        class="w-px h-6 bg-blue-300 mx-16 animate-fade-in-up" style="animation-delay: 0.70s"></div>
    </div>

    <!-- sing in -->
    <div class="flex items-center gap-4 ml-auto opacity-0 animate-showButtons">
      <a v-if="!isAuth" :href="usersLink" class="
          flex items-center justify-center
          block
          border border-[#0A77F3]
          text-sm text-[#0A77F3] font-regular
          h-8
          px-6 py-4
          rounded-full
          hover:ring-4 hover:ring-[#0A77F3]/50
          transition-all duration-300 ease-in-out
          ">
        Sign In
        <img src="/icon/icon-signIn.svg" alt="icon" class="ml-2 w-[20px]" />
      </a>

      <Dropdown v-if="isAuth">
        <template #trigger="{ toggle }">
          <button @click="toggle" class="
                relative
                flex items-center justify-center
                bg-[#0B77F3]
                rounded-full
                text-white
                h-8 w-8
                mr-0 sm:mr-4
                hover:ring-4 hover:ring-[#0B77F3]/50
                focus:ring-4 focus:ring-[#0B77F3]/50
                transition-all duration-300 ease-in-out
              ">
            <!-- User initials -->
            <span
              v-if="!user.profilePhoto && user.firstName && user.lastName"
              class="font-ligth text-sm uppercase"
            >
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </span>

            <!-- Profile photo -->
            <img v-else-if="user.profilePhoto" :src="user.profilePhoto" alt="User profile photo"
              class="h-8 rounded-full object-cover" />

            <!-- Fallback icon -->
            <i v-else class="fas fa-user text-white text-sm" aria-hidden="true"></i>

            <!-- Optional status indicator -->
            <span class="
                  absolute
                  bottom-0 right-[-2px]
                  block
                  h-[12px] w-[12px]
                  rounded-full
                  bg-green-500
                  border-2 border-white
                "></span>
          </button>
        </template>

        <template #content="{ }">
          <!-- Avatar, email, user name -->
          <div class="flex flex-col items-center mb-10">
            <div class="relative --w-16 --h-16">
              <img :src="user.profilePhoto || '/img/user.svg'" alt="Avatar" class="
                    rounded-full
                    w-20 h-20
                    border-2 border-[#9DC9FA]
                    object-cover border" />
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
            <a :href="`${usersLink}/app/users/edit-profile`" class="
                  bg-[#ffffff]
                  w-60
                  px-auto py-[10px] mt-6
                  border border-[#0A77F3]/50 rounded-full
                  text-[#0A77F3] text-xs font-medium text-center
                  hover:bg-[#0A77F3] hover:text-white
                  transition ease-in duration-150
                " target="_blank">
              Manage your digi Account
            </a>
          </div>
          <div class="flex flex-col items-center mx-8 mb-6">
            <!-- community -->
            <h1 class="text-xs font-regular ml-10 sm:ml-4 text-[#3d3d3d] mb-2 self-start
                ">
              Community</h1>

            <a href="https://discord.com/invite/UsGXbTkJSE" target="_blank" class="
                  flex items-center justify-between
                  w-60 px-4 py-2
                  rounded-full border border-[#7DBAFF]
                  bg-[#EDF5FF] text-[#3d3d3d]
                  font-medium text-sm
                  transition-all duration-300
                  hover:border-[#0A77F3] hover:bg-[#0A77F3]/15
                ">
              <div class="flex items-center gap-2">
                <img src="/icon/icon-discordd.svg" alt="Discord" class="h-4 mx-1" />
                <span>Discord</span>
              </div>
              <img src="/icon/icon-outPage.svg" alt="External link" class="w-[20px]" />
            </a>
          </div>
          <div class="flex flex-col items-center mx-8 mb-6">
            <!-- Support -->
            <h1 class="text-xs font-regular ml-10 sm:ml-4 text-[#3d3d3d] mb-2 self-start
                ">
              Support</h1>

            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co" target="_blank" class="
                  flex items-center justify-between
                  w-60 px-4 py-2
                  rounded-full border border-[#7DBAFF]
                  bg-[#EDF5FF] text-[#3d3d3d]
                  font-medium text-sm
                  transition-all duration-300
                  hover:border-[#0A77F3] hover:bg-[#0A77F3]/15
                ">
              <div class="flex items-center gap-2">
                <img src="/icon/icon-mail.svg" alt="mail" class="h-4 mx-1" />
                <span>support@digiapps.com.co</span>
              </div>
            </a>
          </div>

          <!-- Actions -->
          <div class="flex flex-col items-center space-y-2 mt-12">
            <button @click="logout" class="
                  flex items-center justify-around
                  bg-[#0A77F3]
                  w-44
                  rounded-full
                  px-4 py-2
                  text-sm text-white font-regular
                  hover:ring-4 hover:ring-[#0A77F3]/50
                  transition-all duration-300 ease-in-out

                ">
              <span class="flex items-center space-x-2">
                <span>Sign out</span>
                <img src="/icon/icon-logOut.svg" alt="icon" class="ml-2 w-[20px]" />
              </span>
            </button>
          </div>

          <!-- Footer -->
          <div class="flex justify-around mt-8 text-[10px] text-[#3d3d3d] px-16">
            <a
              :href="`${usersLink}/privacy-policy`"
              target="_blank" class="hover:underline hover:text-[#bebebe]"
            >
              Terms of Service
            </a>
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
    </div>
  </nav>
  <!-- Navbar Mobile & Tablet -->
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
import { PaginationI } from '@/store/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();
let searchTimeout: number | undefined;

const { VUE_APP_DG_USERS_APP } = process.env;
let scrollHandler: (() => void) | null = null;
let timeout: number | undefined;

const isMobileMenuOpen = ref(false);
const isSticky = ref(false);
const isRising = ref(false);
const loading = ref<boolean>(false);
const usersLink = ref(`${VUE_APP_DG_USERS_APP}/auth/login?app=sky`);

const isAuth = computed(() => store.getters['auth/isAuth']);
const user = computed<UserI>(() => store.getters['auth/user']);
const pagination = computed<PaginationI>(() => store.state.pagination);

async function handleSearch() {
  store.commit('setPaginationPage', 1);
  await store.dispatch('files/filter', pagination.value);
}

async function handleInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500);
}

function logout() {
  store.dispatch('auth/logout');
}

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

watch(isMobileMenuOpen, (open) => {
  if (open) {
    document.documentElement.style.overflow = 'hidden'; // bloquea html
    document.body.style.overflow = 'hidden'; // bloquea body
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
});

watch(
  () => pagination.value,
  () => {
    // cancel previous timeout
    if (timeout) clearTimeout(timeout);

    // start new timeout
    timeout = window.setTimeout(() => {
      handleSearch();
    }, 500);
  },
  { deep: true },
);
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
