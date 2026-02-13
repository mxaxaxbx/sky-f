<template>
  <Teleport to="body">
    <!-- Backdrop overlay -->
    <!-- Sidebar -->
    <Transition
      name="sidebar"
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
    <aside
      id="default-sidebar"
      aria-label="Navigation Sidebar"
      @click.stop
      class="
        fixed top-0 left-0 h-full pt-10 ml-1
        bg-[var(--bg)] backdrop-blur-md
        sm:border-r sm:border-[var(--border)]
        shadow-md shadow-gray-900/10
        overflow-hidden

        transition-[width] duration-300 ease-out

        lg:shadow-none
        sm:block sm:pt-0 sm:ml-0
      "
      :class="showSidebar ? 'w-full pr-2 sm:pr-0 sm:w-64' : 'w-0 mr-6 -ml-2 sm:w-12'"
    >
        <div class="flex flex-col h-full pt-12 pb-4">
          <div class="flex px-2 items-center justify-between">
            <!-- Texto -->
            <span
              v-show="showSidebar"
              class="font-semibold text-[var(--text-secondary)] hidden sm:inline"
            >
              Menu
            </span>

            <button
              @click="toggleSidebar"
              class="h-10 flex items-center transition-all duration-200 hidden sm:flex"
              :class="showSidebar ? 'justify-between' : 'justify-center mx-auto'
              ">
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
          </div>
            <!-- Authenticated Menu -->
            <div v-if="isAuth" class="px-1 py-1.5 mt-1">
              <ul class="space-y-2 font-semibold text-[#7f7f7f]">
                <li>
                  <router-link
                    to="/app/files"
                    @click="handleNavClick"
                    class="
                      w-full group
                      flex items-center
                      transition-all duration-200
                      text-sm font-regular
                      rounded-xl

                      hover:bg-[var(--hover-bg)]
                      hover:text-[var(--text)]
                      hover:border-[var(--hover-border)]
                      hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
                    "
                    :class="showSidebar
                      ? 'justify-start px-2 py-1.5'
                      : 'justify-center py-1.5'"
                    active-class="
                      bg-[var(--bg-secondary)] text-[var(--text-terceary)]
                      border border-[var(--border)]
                    ">
                    <div class="w-6 h-6 flex items-center justify-center">
                      <img
                        src="/icon/icon-cloudDrive.svg"
                        alt="report"
                        class="w-6 h-6"
                      />
                    </div>
                    <span
                      v-show="showSidebar" class="ml-3 whitespace-nowrap">
                      Cloud Drive
                    </span>
                  </router-link>
                </li>
                <!-- trash folder -->
                <li v-if="trashFolder.id !== 0">
                  <router-link
                    :to="`/app/files/folder/${trashFolder.id}`"
                    @click="handleNavClick"
                    class="
                      w-full
                      group
                      flex items-center
                      transition-all duration-200
                      text-sm font-regular
                      rounded-xl
                      hover:bg-[var(--hover-bg)] hover:text-[var(--text)] hover:border-[var(--hover-border)]
                      hover:shadow-[0_0_2px_1px_rgba(10,119,243,0.3)]
                    "
                    :class="showSidebar ? 'justify-start px-2 py-1.5' : 'justify-center py-1.5'"
                  >
                    <div class="w-6 h-6 flex items-center justify-center">
                      <img
                        src="/icon/icon-trash.svg"
                        alt="trash"
                        class="w-6 h-6"
                      />
                    </div>
                    <span
                      v-show="showSidebar" class="ml-3 whitespace-nowrap">
                      Trash
                    </span>
                  </router-link>
                </li>
              </ul>
            </div>

          <!-- Spacer for authenticated users -->
          <div v-if="isAuth" class="flex-1 flex flex-col justify-end px-1">
            <div class="flex justify-between"
            :class="showSidebar
                ? 'flex-row gap-2'
                : 'flex-col'
              ">
            <!-- upgrade plan -->
            <a
              :href="`${VUE_APP_DG_SUBS}/auth/confirmsession?token=${token}&redirect=/app/services/sky`"
              class="
                group w-full
                flex items-center
                transition-all duration-200
                text-sm text-[var(--text-terceary)]
                rounded-xl border border-[var(--border)]

                hover:bg-[var(--hover-bg)]
                hover:text-[var(--text)]
                hover:border-[var(--hover-border)]
                hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.3)]
              "
              :class="showSidebar
                ? 'justify-start px-2 py-1.5'
                : 'justify-center py-1.5'
              "
            >
              <div class="w-6 h-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="
                    w-6 h-6
                    text-[var(--text-terceary)]
                    transition-all duration-150
                    group-hover:text-[var(--color-primary)]
                    arrow-move
                  ">
                  <g mask="url(#mask0_1358_7)">
                    <path
                      fill-rule="evenodd"
                      d="M5.65005 10.0251L7.60005 10.8501C7.83338 10.3834 8.07505 9.93344 8.32505 9.50011C8.57505 9.06677 8.85005 8.63344 9.15005 8.20011L7.75005 7.92511L5.65005 10.0251ZM9.20005 12.1001L12.05 14.9251C12.75 14.6584 13.5 14.2501 14.3 13.7001C15.1 13.1501 15.85 12.5251 16.55 11.8251C17.7167 10.6584 18.6292 9.36261 19.2875 7.93761C19.9459 6.51261 20.2334 5.20011 20.15 4.00011C18.95 3.91677 17.6334 4.20427 16.2 4.86261C14.7667 5.52094 13.4667 6.43344 12.3 7.60011C11.6 8.30011 10.975 9.05011 10.425 9.85011C9.87505 10.6501 9.46672 11.4001 9.20005 12.1001ZM13.65 10.4751C13.2667 10.0918 13.075 9.62094 13.075 9.06261C13.075 8.50427 13.2667 8.03344 13.65 7.65011C14.0334 7.26677 14.5084 7.07511 15.075 7.07511C15.6417 7.07511 16.1167 7.26677 16.5 7.65011C16.8834 8.03344 17.075 8.50427 17.075 9.06261C17.075 9.62094 16.8834 10.0918 16.5 10.4751C16.1167 10.8584 15.6417 11.0501 15.075 11.0501C14.5084 11.0501 14.0334 10.8584 13.65 10.4751ZM14.125 18.5001L16.225 16.4001L15.95 15.0001C15.5167 15.3001 15.0834 15.5709 14.65 15.8126C14.2167 16.0543 13.7667 16.2918 13.3 16.5251L14.125 18.5001ZM21.95 2.17511C22.2667 4.19177 22.0709 6.15427 21.3625 8.06261C20.6542 9.97094 19.4334 11.7918 17.7 13.5251L18.2 16.0001C18.2667 16.3334 18.25 16.6584 18.15 16.9751C18.05 17.2918 17.8834 17.5668 17.65 17.8001L13.45 22.0001L11.35 17.0751L7.07505 12.8001L2.15005 10.7001L6.32505 6.50011C6.55838 6.26677 6.83755 6.10011 7.16255 6.00011C7.48755 5.90011 7.81672 5.88344 8.15005 5.95011L10.625 6.45011C12.3584 4.71677 14.175 3.49177 16.075 2.77511C17.975 2.05844 19.9334 1.85844 21.95 2.17511ZM3.92505 15.9751C4.50838 15.3918 5.22088 15.0959 6.06255 15.0876C6.90422 15.0793 7.61672 15.3668 8.20005 15.9501C8.78338 16.5334 9.07088 17.2459 9.06255 18.0876C9.05422 18.9293 8.75838 19.6418 8.17505 20.2251C7.75838 20.6418 7.06255 21.0001 6.08755 21.3001C5.11255 21.6001 3.76672 21.8668 2.05005 22.1001C2.28338 20.3834 2.55005 19.0376 2.85005 18.0626C3.15005 17.0876 3.50838 16.3918 3.92505 15.9751ZM5.35005 17.3751C5.18338 17.5418 5.01672 17.8459 4.85005 18.2876C4.68338 18.7293 4.56672 19.1751 4.50005 19.6251C4.95005 19.5584 5.39588 19.4459 5.83755 19.2876C6.27922 19.1293 6.58338 18.9668 6.75005 18.8001C6.95005 18.6001 7.05838 18.3584 7.07505 18.0751C7.09172 17.7918 7.00005 17.5501 6.80005 17.3501C6.60005 17.1501 6.35838 17.0543 6.07505 17.0626C5.79172 17.0709 5.55005 17.1751 5.35005 17.3751Z" clip-rule="evenodd"/>
                  </g>
                </svg>
              </div>
              <span
                v-show="showSidebar" class="ml-3 whitespace-nowrap font-semibold">
                Upgrade Your Plan
              </span>
            </a>
            <!-- chnage theme -->
            <button
              @click="toggleTheme"
              class="flex items-center rounded-xl w-10 h-10"
              :class="showSidebar
                ? 'justify-center px-2 py-1.5'
                : 'justify-center px-2 py-1.5'
              "
              >
              <img
                :src="isLight
                ? '/icon/icon-light.svg'
                : '/icon/icon-dark.svg'"
                alt="theme toggle"
                class="w-5 h-5 m-1 opacity-70 hover:opacity-100 transition" />
            </button>
            </div>
            </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  watch,
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';

import { PermissionI } from '@/store/auth/state';

const token = localStorage.getItem('token');

const store = useStore();

// Track when user is interacting with project dropdown
const isProjectDropdownActive = ref(false);

// Track window width for responsive behavior
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
const VUE_APP_DG_SUBS = ref(process.env.VUE_APP_DG_SUBS);

// Update window width on resize
function handleResize() {
  windowWidth.value = window.innerWidth;
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

// Computed properties with proper typing
const permissions = computed<PermissionI[]>(() => store.getters['auth/permissions']);
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const isAuth = computed(() => store.getters['auth/isAuth']);
const isLight = computed(() => store.state.theme?.theme === 'light');
// const projects = computed<BusinessI[]>(() => store.getters['auth/projects']);
// const project = computed(() => store.getters['auth/project']);

// Show sidebar based on state (can be toggled on all screen sizes)
const showSidebar = computed(() => showSidebarState.value);
const trashFolder = computed(() => store.state.folders.trashFolder);

const toggleTheme = () => {
  store.dispatch('theme/toggleTheme');
  const newTheme = store.state.theme.theme;

  document.documentElement.classList.toggle('light', newTheme === 'light');
};

const toggleSidebar = () => {
  store.commit('toggleSidebar');
};

// Close sidebar function
function closeSidebar() {
  // Don't close if project dropdown is active
  if (isProjectDropdownActive.value) {
    return;
  }
  store.commit('closeSidebar');
}

// Function to handle navigation link clicks
function handleNavClick() {
  // Close sidebar
  closeSidebar();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

watch(windowWidth, (w) => {
  if (w < 640 && store.state.sidebar) {
    store.commit('closeSidebar');
  }
});

// Handle escape key (mobile only)
function handleEscape(event: KeyboardEvent) {
  if (windowWidth.value < 1024 && event.key === 'Escape' && showSidebar.value && !isProjectDropdownActive.value) {
    closeSidebar();
  }
}

// Add escape key listener
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', handleEscape);
}

async function getTrashFolder() {
  await store.dispatch('folders/getTrashFolder');
}

onMounted(() => {
  getTrashFolder();
});

// Cleanup event listeners
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('keydown', handleEscape);
  }
});

</script>

<style scoped>
.group:hover .arrow-move {
    animation: arrowMove 1s ease-in-out;
  }

  @keyframes arrowMove {
    1% {
      transform: rotate(0deg) translate(0, 0);
      opacity: 1;
    }
    40% {
      transform: rotate(0deg) translate(6px, -6px);
      opacity: 0;
    }
    60% {
      transform: rotate(0deg) translate(-6px, 6px);
      opacity: 0;
    }
    100% {
      transform: rotate(0deg) translate(0, 0);
      opacity: 1;
    }
  }
/* Custom scrollbar for the navigation */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.4);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.6);
}

/* Smooth focus styles */
a:focus-visible, button:focus-visible, select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ensure select dropdown appears above other elements */
select {
  position: relative;
  z-index: 60;
}
</style>
