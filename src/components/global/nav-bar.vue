<template>
    <nav
    class="
      w-[55%]
      bg-white
      py-2
      flex items-center justify-between mx-auto
      rounded-full mt-8
      reltive
      font-alexandria
    "
  >
    <!-- LOGO -->
    <router-link :to="isAuthenticated ? '/app' : '/'">
      <img
        src="dgsky-logo.svg"
        alt="logo"
        class="w-20 ml-8"
      >
    </router-link>
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center">
  <div class="w-px h-6 bg-gray-200 mx-16"></div>
  <div class="flex items-center gap-6 text-gray-500 font-semibold text-md">
    <a href="#features" class="px-3 hover:text-[#0A77F3]">Features</a>
    <a href="#plans" class="px-3 hover:text-[#0A77F3]">Plans</a>
    <a href="#services" class="px-3 hover:text-[#0A77F3]">Services</a>
    <a href="#faq" class="px-3 hover:text-[#0A77F3]">FAQ</a>
  </div>
  <div class="w-px h-6 bg-gray-200 mx-16"></div>
</div>
    <!-- REGISTER + USER, agrupados y pegados a la derecha -->
    <div class="flex items-center gap-4 ml-auto mr-2">
      <!-- Botón Register -->
      <button
        class="border border-[#0A77F3] text-lg text-[#0A77F3] font-semibold h-10 px-8
        rounded-full hover:bg-[#0A77F3] hover:text-white transition-all"
      >
        Register
      </button>

      <!-- Ícono de usuario -->
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
