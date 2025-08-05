<template>
  <nav
    class="
      h-14
      bg-white
      py-2
      flex items-center justify-between mx-auto
      rounded-full mt-8
      relative
      font-alexandria
      animate-expandNav
      overflow-hidden
    "
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
  <div class="w-px h-6 bg-blue-300 mx-16 opacity-0 animate-fade-in-up"
       style="animation-delay: 0.70s"></div>

  <div class="flex items-center gap-16 text-gray-500 font-semibold text-md">
    <a href="#features"
       class="nav-link opacity-0 animate-fade-in-up"
       style="animation-delay: 0.80s"
    >Features</a>

    <a href="#plans"
       class="nav-link opacity-0 animate-fade-in-up"
       style="animation-delay: 0.90s"
    >Plans</a>

    <a href="#services"
       class="nav-link opacity-0 animate-fade-in-up"
       style="animation-delay: 1.0s"
    >Services</a>

    <a href="#faq"
       class="nav-link opacity-0 animate-fade-in-up"
       style="animation-delay: 1.10s"
    >FAQ</a>
  </div>

  <div class="w-px h-6 bg-blue-300 mx-16 opacity-0 animate-fade-in-up"
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
        class="bg-[#0A77f3] w-10 h-10 rounded-full flex justify-center items-center"
      >
        <a :href="usersLink" aria-label="User Profile">
          <i class="fas fa-user text-white text-lg" aria-hidden="true"></i>
          <span class="sr-only">User Profile</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue';
import { useStore } from 'vuex';

import { UserI } from '@/store/auth/state';
import { OptionI } from '@/store/state';

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
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important; }
}

/* clase base para cada link */
.nav-link {
  position: relative;
  display: inline-block;
  padding-bottom: 0.125rem; /* espacio para la línea sin mover el layout */
  color: inherit;
  text-decoration: none;
  outline: none;
}

/* pseudo-elemento que será la línea animada */
.nav-link {
  @apply
    px-3
    text-gray-500
    font-semibold
    text-base
    transition-colors
    duration-300
    ease-in-out
    hover:text-[#0A77F3];
}

</style>
