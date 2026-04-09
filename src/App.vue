<template>
  <div class="bg-[var(--bg)] h-full">
    <!-- Dark overlay (mobile only) -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black opacity-50 z-30 hidden"
      @click="toggleSidebar"
      @keydown="toggleSidebar"
      >
    </div>
    <!-- menu -->
    <Notifications />
    <Navbar />

    <!-- global file input -->
    <label for="fileInputBtn"></label>
    <input
      id="fileInputBtn"
      type="file"
      class="hidden bg-red-500 text-white z-[1000]"
      ref="fileInputBtn"
      @change="uploadFile"
      multiple
      :key="inputKey"
      @click="() => { if (fileInputBtn) fileInputBtn.value = '' }"
    />
    <!-- search box movil-->
    <div
      v-if="!hideBar"
      class="
        fixed top-10
        flex flex-col justify-center
        w-full px-2 pt-2
        bg-[var(--bg)] z-20

        sm:hidden
      "
    >
      <div class="flex flex-row items-center w-full mb-2">
        <button
          @click="toggleSidebar"
          class="h-10 flex items-center transition-all duration-200"
          :class="showSidebar ? 'justify-center' : 'justify-center'
          "
        >
          <!-- Ícono wrapper -->
          <div class="w-6 h-6 flex items-center justify-center">
            <img
              :src="showSidebar
                ? '/icon/icon-close.svg'
                : '/icon/icon-open.svg'"
              :alt="showSidebar ? 'close' : 'open'"
              class="w-6 h-6 opacity-50 hover:opacity-100 transition"
            />
          </div>
        </button>
        <span
          class="text-[var(--text)] font-semibold text-center"
          :class="showSidebarMovil ? 'inline w-full -ml-6' : 'hidden'"
          >
            Menu
        </span>

        <label for="search" class="text-[#a3a3a3]"></label>
        <!-- Contenedor relativo -->
        <form @submit.prevent="handleSearch"
          :class="showSidebarMovil ? 'hidden' : 'inline'"
          class="relative w-full ml-2
          "
        >
          <!-- Input -->
          <input
            v-model="query"
            @input="handleInput"
            type="text"
            placeholder="Search everything"
            class="
              w-full
              pl-8 pr-4 py-1
              bg-[var(--bg-secondary)]
              border border-[#0B77F3]/50
              rounded-full
              font-light text-[var(--text)] text-xs

              hover:shadow-[0_0_2px_2px_rgba(10,119,243,0.5)]
              hover:border-[var(--hover-border)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:outline-none
              transition-all duration-300
            "
          />

          <!-- Ícono dentro del input -->
          <img src="/icon/icon-search.svg" alt="Search Icon"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-5 pointer-events-none"
          />
        </form>
      </div>
    </div>

    <!-- sidebar wrapper -->
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

              sm:px-24
            "
          >
            <div
              class="
                flex flex-col
                justify-between
                w-full
                py-16 mb-8

                sm:flex-row sm:items-start
              "
              >
              <a
                :href="`${usersLink}`"
                target="_blank"
                class="mb-10 sm:mb-0
                "
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
                "
              >
              <div class="text-left">
                <h3 class="text-sm text-[var(--text)] font-regular mb-4">Products</h3>
                <ul
                  class="
                    space-y-2
                    text-xs text-[var(--text)] font-light
                    pl-1
                  "
                >
                  <li>
                    <router-link
                      :to="isAuth ? '/app' : '/'"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Sky
                    </router-link>
                  </li>
                  <li>
                    <a
                      href="https://fireweb.digiapps.com.co/"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Fireweb
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://care.digiapps.com.co/"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Care
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://utils.digiapps.com.co/"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Utils
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
                  "
                >
                  <li>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@digiapps.com.co"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://discord.gg/n8NHa6sJbc"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
              <div class="text-left">
                <h3 class="text-sm text-[var(--text)] font-regular mb-4">Legal</h3>
                <ul
                  class="
                    space-y-2
                    text-xs text-[var(--text)] font-light
                    pl-1
                  "
                >
                  <li>
                    <a
                      :href="`${usersLink}/privacy-policy`"
                      target="_blank"
                      class="
                        opacity-50 hover:opacity-100
                        transition-all duration-300 ease-in-out
                      "
                    >
                      Privacy Policy
                    </a>
                  </li>
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
              "
            >
              <p class="text-xs text-[var(--text-secondary)] font-light">&copy;
                {{ currentYear }} digi systems All rights reserved.</p>
              <button
                @click="toggleTheme"
                class="rounded-full">
                <img
                  :src="isLight
                  ? '/icon/icon-light.svg'
                  : '/icon/icon-dark.svg'"
                  alt="theme toggle"
                  class="w-5 h-5 opacity-70 hover:opacity-100 transition"
                />
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
import router from '@/router';

const store = useStore();
const route = useRoute();

const Notifications = defineAsyncComponent(() => import('@/components/global/notifications.vue'));
const Sidebar = defineAsyncComponent(() => import('@/components/global/sidebar.vue'));
const Navbar = defineAsyncComponent(() => import('@/components/global/navbar.vue'));

let searchTimeout: number | undefined;

const fileInputBtn = ref<HTMLInputElement | null>(null);
const inputKey = ref(0);

async function uploadFile(): Promise<void> {
  const input = fileInputBtn.value;
  if (!input || !input.files || input.files.length === 0) return;

  const filesArray = Array.from(input.files);

  const formData = new FormData();
  filesArray.forEach((fileItem) => {
    console.log('fileItem->', fileItem);
    formData.append('file', fileItem);
  });

  let currentFolderId: number | null = null;
  if (route.name === 'folder-details' || route.path.includes('/app/folders/')) {
    currentFolderId = route.params.id ? Number(route.params.id) : null;
  }

  try {
    console.log('formData->', formData);
    await store.dispatch('files/upload', { formData, folderId: currentFolderId });
  } catch (error: unknown) {
    console.error(error);
  } finally {
    if (fileInputBtn.value) {
      fileInputBtn.value.value = '';
    }

    // eslint-disable-next-line no-plusplus
    inputKey.value++;
  }
}

const { VUE_APP_DG_USERS_APP } = process.env;

const year = ref(new Date().getUTCFullYear());
const usersLink = ref(`${VUE_APP_DG_USERS_APP}`);
const query = ref<string>('');

const isHome = computed(() => route.name === 'home');
const hideBar = computed(() => route.name === 'home' || route.name === 'login' || route.name === 'register');
const isAuth = computed(() => store.getters['auth/isAuth']);
const isLight = computed(() => store.state.theme?.theme === 'light');
const showSidebar = computed(() => isAuth.value && route.name !== 'home');
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const showSidebarMovil = computed(() => showSidebarState.value);

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

async function handleSearch() {
  const payload = {
    page: 1,
    q: query.value,
  };

  await store.dispatch('files/filter', payload);
  router.replace({
    query: {
      ...payload,
    },
  });

  router.push({
    path: '/app/search',
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
