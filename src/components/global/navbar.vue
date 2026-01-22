<template>
  <nav
    class="
      fixed z-50
      font-alexandria font-sans
      bg-[var(--bg)]
      border-b border-[var(--border)]
      w-full h-10
      px-2  sm:px-4
    ">
    <div class="flex items-center justify-between h-full">
      <div class="flex space-x-8">
        <!-- LOGO animado -->
        <router-link
          :to="isAuth ? '/app' : '/'"
          class=""
          >
          <img
            :src="isLight
            ? '/img/logo-sky.svg'
            : '/img/logo-sky-light.svg'"
            alt="logosky"
            class="
              h-5
              courser-pointer"
              />
        </router-link>
      </div>

      <!-- search box -->
      <div v-if="isAuth"
        class="
          absolute left-1/2 -translate-x-1/2 flex items-center
          md:w-80 lg:w-[600px]
          hidden sm:flex
          text-xs
        ">
        <label for="search" class="text-[#a3a3a3] hidden"></label>

        <!-- Contenedor relativo -->
        <form @submit.prevent="handleSearch" class="relative w-full">
          <!-- Input -->
          <input
            v-model="query"
            @input="handleInput"
            type="text"
            placeholder="Search everything"
            class="
              w-full
              pl-10 pr-4 py-1
              bg-[var(--bg-secondary)]
              border border-[#0B77F3]/50
              rounded-full
              font-light text-[var(--text)]

              hover:shadow-[0_0_2px_2px_rgba(10,119,243,0.5)]
              hover:border-[var(--hover-border)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300
            "/>

            <!-- Ícono dentro del input -->
            <img src="/icon/icon-search.svg" alt="Search Icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 pointer-events-none" />
         </form>
      </div>

      <!-- sing in -->
      <div class="flex items-center gap-4 ml-auto opacity-0 animate-showButtons">
        <a v-if="!isAuth" :href="`${usersLink}/auth/provider?app=sky`"
          class="
            flex items-center justify-center
            bg-[var(--bg-secondary)]
            border border-[var(--color-primary)]
            text-[var(--color-primary)] text-sm font-regular
            pl-3 pr-2
            rounded-full

            hover:bg-[var(--hover-bg)]
            hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
            transition-all duration-300 ease-in-out
          ">
          Sign In
          <img src="/icon/icon-signIn.svg" alt="icon" class="ml-1 h-4" />
        </a>

      <Dropdown v-if="isAuth">
        <template #trigger="{ toggle }">
          <button
            @click="toggle"
            class="
              relative flex items-center justify-center
              bg-[#0B77F3]
              h-6 w-6
              mr-0
              rounded-full
              text-white

              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300 ease-in-out
            ">
            <!-- User initials -->
            <span
              v-if="!user.profilePhoto && user.firstName && user.lastName"
              class="font-light text-sm uppercase">
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </span>

            <!-- Profile photo -->
            <img v-else-if="user.profilePhoto" :src="user.profilePhoto" alt="User profile photo"
              class="h-8 rounded-full object-cover" />

            <!-- Fallback icon -->
            <i v-else class="fas fa-user text-white text-sm" aria-hidden="true"></i>

            <!-- Optional status indicator -->
            <span
              class="
                absolute
                bottom-[-1.5px] right-[-3.5px]
                block
                h-[10px] w-[10px]
                rounded-full
                bg-green-500
                border-2 border-[var(--bg)]
                ">
            </span>
          </button>
        </template>

        <template #content="{ }">
          <!-- Avatar, email, user name -->
          <div class="flex flex-col items-center mb-10">
            <div class="relative --w-16 --h-16">
              <!-- Avatar con foto o fallback -->
              <img
                v-if="user && user.profilePhoto"
                :src="user.profilePhoto"
                alt="User avatar"
                class="rounded-full w-20 h-20 border-2 border-[#9DC9FA] object-cover"
                @error="onImageError"
              />
              <span
                v-else-if="user && user.firstName && user.lastName"
                class="
                  flex items-center justify-center
                  w-20 h-20
                  rounded-full bg-[var(--color-primary)]
                  text-white font-regular text-4xl uppercase
                ">
                {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
              </span>
              <img
                v-else
                src="/img/user.svg"
                alt="Default avatar"
                class="rounded-full w-20 h-20 border-2 border-[#9DC9FA] object-cover"
              />
            </div>

            <h2 class="mt-4 text-lg font-semibold text-[var(--text)]">¡Hi,
              {{ user.firstName }} {{ user.lastName }}!
            </h2>

            <!-- Email -->
            <div class="text-center mt-0">
              <p class="text-[#A3A3A3] text-xs font-light">
                {{ user.email }}
              </p>
            </div>

            <!-- Manage Account Button -->
            <a :href="`${usersLink}/app/users/edit-profile`"
              class="
                bg-[var(--bg-secondary)]
                border border-[var(--color-primary)]
                rounded-full
                w-48 px-auto py-1 mt-6
                text-[var(--color-primary)] text-xs text-center font-medium

                hover:bg-[var(--hover-bg)]
                hover:text-[var(--text)]
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300 ease-in-out"
              >
              Manage your digi Account
            </a>
          </div>
          <div class="flex flex-col items-center mx-8 mb-6">
            <!-- community -->
            <h1 class="text-xs font-regular ml-5 sm:ml-8 text-[#3d3d3d] mb-2 self-start
                ">Community
            </h1>

            <a href="https://discord.com/invite/UsGXbTkJSE"
              target="_blank"
              class="
                flex items-center justify-between
                w-72 px-2 py-2
                bg-[var(--bg-secondary)]
                border border-[var(--border)]
                rounded-full
                text-[#868686] font-regular text-sm

                sm:w-52 sm:text-xs sm:py-1

                hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)]
                hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
                transition-colors duration-300
              ">
              <div class="flex items-center gap-2">
                <img src="/icon/icon-discordd.svg"
                alt="Discord"
                class="h-4 mx-1" />
                <span>Discord</span>
              </div>
              <img src="/icon/icon-outPage.svg" alt="External link" class="h-4" />
            </a>
          </div>
          <div class="flex flex-col items-center mx-8 mb-6">
            <!-- Support -->
            <h1 class="text-xs font-regular ml-5 sm:ml-8 text-[#3d3d3d] mb-2 self-start
                ">Support
            </h1>

            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
              target="_blank"
              class="
                flex items-center justify-between
                w-72 px-2 py-2
                bg-[var(--bg-secondary)]
                border border-[var(--border)]
                rounded-full
                text-[#868686] font-regular text-sm

                sm:w-52 sm:text-xs sm:py-1

                hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)]
                hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
                transition-colors duration-300
              ">
              <div class="flex items-center gap-2">
                <img src="/icon/icon-mail.svg" alt="mail" class="h-4 mx-1" />
                <span>support@digiapps.com.co</span>
              </div>
            </a>
          </div>

          <!-- Actions -->
          <div class="flex flex-col items-center space-y-2 mt-12">
            <button @click="logout"
              class="
                flex items-center justify-around
                bg-[#0A77F3]
                w-36
                rounded-full
                py-1
                text-sm text-white font-regular

                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300 ease-in-out
              ">
              <span class="flex items-center space-x-2">
                <span>Sign out</span>
                <img src="/icon/icon-logOut.svg" alt="icon" class="ml-2 h-4" />
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
              target="_blank" class="hover:underline hover:text-[#bebebe]
              ">
              Privacy Policy
            </a>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
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
import { useRoute } from 'vue-router';
import router from '@/router';

import { UserI } from '@/store/auth/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const store = useStore();
const route = useRoute();
let searchTimeout: number | undefined;

const { VUE_APP_DG_USERS_APP } = process.env;
let scrollHandler: (() => void) | null = null;
let timeout: number | undefined;

const isMobileMenuOpen = ref(false);
const isSticky = ref(false);
const isRising = ref(false);
const loading = ref<boolean>(false);
const usersLink = ref(`${VUE_APP_DG_USERS_APP}`);
const query = ref<string>('');

const isAuth = computed(() => store.getters['auth/isAuth']);
const user = computed<UserI>(() => store.getters['auth/user']);
const isLight = computed(() => store.state.theme.theme === 'light');

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = '/img/user.svg';
}

async function handleSearch() {
  const payload = {
    page: 1,
    query: query.value,
  };

  await store.dispatch('files/filter', payload);
  router.replace({
    query: {
      ...payload,
    },
  });
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

async function checkURLQuery() {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 100));
  const q = typeof route.query.query === 'string' ? route.query.query : '';
  console.log('Setting query from URL:', q);
  if (q) {
    query.value = q;
    handleSearch();
  }
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

  checkURLQuery();
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
  () => query.value,
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
