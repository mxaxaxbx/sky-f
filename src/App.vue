<template>
  <div class="bg-[var(--bg)] min-h-full">
    <!-- Dark overlay (mobile only) -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black opacity-50 z-30 hidden"
      @click="toggleSidebar"
      @keydown="toggleSidebar"
      ></div>
    <!-- menu -->
    <Notifications />
    <Navbar />
    <div
      class="
        w-full fixed
        z-40
      "
    >
      <!-- sidebar -->
      <Sidebar v-if="showSidebar && !isHome" />
    </div>

    <!-- content -->
    <div
  class="overflow-y-auto transition-[padding] duration-300"
  :class="
    !isAuth || isHome
      ? 'pl-0'
      : store.state.sidebar
        ? 'sm:pl-64'
        : 'sm:pl-10'
  "
>
      <div class="flex-1 flex flex-col">
        <div class="min-h-screen">
          <router-view />
        </div>
        <!-- footer -->
        <footer
        v-if="!showSidebar"
          class="bg-[var(--bg)] group">
          <div class="w-full h-px bg-line"></div>
          <div
            class="
            container mx-auto px-12 text-center

            sm:px-24">
            <div
              class="
                flex flex-col
                justify-between
                w-full
                py-16 mb-8

                sm:flex-row sm:items-start
              ">
              <a
                :href="`${usersLink}`"
                target="_blank"
                class="mb-10 sm:mb-0"
                >
                <img
                  :src="isLight
                  ? '/img/logo-digi-light.svg'
                  : '/img/logo-digi.svg'"
                  alt="Logo"
                  class="
                  h-6 opacity-30
                  group-hover:opacity-100
                  courser-pointer"
                />
              </a>
              <div
                class="
                  flex space-x-12
                  mr-0
                  opacity-30
                  group-hover:opacity-100
                  transition-all duration-500 ease-in-out

                  sm:mr-20 sm:mx-0
                  sm:space-x-20
                ">
              <div class="text-left">
                <h3 class="text-sm text-[var(--text)] font-regular mb-4">Products</h3>
                <ul
                  class="
                    space-y-2
                    text-xs text-[var(--text)] font-light
                    pl-1
                  ">
                  <li><router-link
                    :to="isAuth ? '/app' : '/'"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">
                      Sky</router-link></li>
                  <li><a
                    href="https://fireweb.digiapps.com.co/"
                    target="_blank"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">Fireweb</a></li>
                  <li><a
                    href="#"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">Care
                    </a>
                  </li>
                  <li><a
                    href="#"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">Utils
                    </a>
                  </li>
                </ul>
              </div>
              <div class="text-left">
                <h3 class="text-sm text-[var(--text)] font-regular mb-4">Contact Us</h3>
                <ul
                  class="
                    space-y-2
                    text-xs text-[var(--text)] font-light
                    pl-1
                  ">
                  <li><a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
                    target="_blank"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">
                      Help Center</a></li>
                  <li><a
                    href="https://discord.gg/UsGXbTkJSE"
                    target="_blank"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">Discord</a></li>
                </ul>
              </div>
              <div class="text-left">
                <h3 class="text-sm text-[var(--text)] font-regular mb-4">Legal</h3>
                <ul
                  class="
                    space-y-2
                    text-xs text-[var(--text)] font-light
                    pl-1
                  ">
                  <li><a
                    :href="`${usersLink}/privacy-policy`"
                    target="_blank"
                    class="
                      opacity-50 hover:opacity-100
                      transition-all duration-300 ease-in-out
                      ">
                      Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            </div>
            <div
              class="
                flex justify-between items-center
                border-t border-[var(--border)]
                pt-8
                pb-20
              ">
            <p class="text-xs text-[var(--text-secondary)] font-light">&copy;
              {{ currentYear }} digi systems All rights reserved.</p>
              <button
              @click="toggleTheme"
              class="
              rounded-full">
              <img
                :src="isLight
                ? '/icon/icon-light.svg'
                : '/icon/icon-dark.svg'"
                alt="theme toggle"
                class="w-5 h-5 opacity-70 hover:opacity-100 transition" />
            </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  watch,
  defineAsyncComponent,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const Sidebar = defineAsyncComponent(() => import('@/components/global/sidebar.vue'));
const Notifications = defineAsyncComponent(() => import('@/components/global/notifications.vue'));
const Navbar = defineAsyncComponent(() => import('@/components/global/navbar.vue'));

const store = useStore();
const route = useRoute();

const { VUE_APP_DG_USERS_APP } = process.env;

const isHome = computed(() => route.name === 'home');
const isAuth = computed(() => store.getters['auth/isAuth']);
const showSidebar = computed(
  () => isAuth.value && route.name !== 'home',
);
const isLight = computed(() => store.state.theme?.theme === 'light');
const year = ref(new Date().getUTCFullYear());
const usersLink = ref(`${VUE_APP_DG_USERS_APP}`);

const clickOutside = () => {
  if (showSidebar.value) store.commit('toggleSidebar');
};

const toggleTheme = () => {
  store.dispatch('theme/toggleTheme');
  const newTheme = store.state.theme.theme;

  document.documentElement.classList.toggle('light', newTheme === 'light');
};

const toggleSidebar = () => {
  store.commit('toggleSidebar');
};

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
