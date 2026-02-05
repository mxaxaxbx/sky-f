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
        fixed top-0 left-0 h-full
        bg-[var(--bg)] backdrop-blur-md
        border-r border-[var(--border)]
        shadow-xl shadow-gray-900/10
        overflow-hidden

        transition-[width] duration-300 ease-out

        lg:shadow-none
        hidden sm:block
      "
      :class="showSidebar ? 'w-64' : 'w-12 mr-6'"
    >
        <div class="flex flex-col h-full pt-12 pb-4">
          <div class="flex px-3 items-center justify-between">
            <!-- Texto -->
            <span
              v-show="showSidebar"
              class="font-semibold text-[var(--text-secondary)]"
            >
              Menu
            </span>

            <button
              @click="toggleSidebar"
              class="h-10 flex items-center transition-all duration-200"
              :class="showSidebar ? 'justify-between px-3' : 'justify-center'
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
                <!-- Add more authenticated menu items here -->
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
              </ul>
            </div>

            <!-- Spacer for authenticated users -->
          <div v-if="isAuth" class="flex-1 flex items-end ml-3.5 justify-start">
            <button
              @click="toggleTheme"
              class="rounded-full">
              <img
                :src="isLight
                ? '/icon/icon-light.svg'
                : '/icon/icon-dark.svg'"
                alt="theme toggle"
                class="w-5 h-5 opacity-70 hover:opacity-100 transition" />
              </button>
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
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { PermissionI } from '@/store/auth/state';
// import { BusinessI } from '@/store/state';

const store = useStore();
const route = useRoute();

// Track when user is interacting with project dropdown
const isProjectDropdownActive = ref(false);

// Track window width for responsive behavior
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);

// Update window width on resize
function handleResize() {
  windowWidth.value = window.innerWidth;
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

// Computed properties with proper typing
const isMobile = computed(() => windowWidth.value < 640);
const permissions = computed<PermissionI[]>(() => store.getters['auth/permissions']);
const showSidebarState = computed<boolean>(() => store.state.sidebar);
const isAuth = computed(() => store.getters['auth/isAuth']);
const isLight = computed(() => store.state.theme?.theme === 'light');
// const projects = computed<BusinessI[]>(() => store.getters['auth/projects']);
// const project = computed(() => store.getters['auth/project']);

// Show sidebar based on state (can be toggled on all screen sizes)
const showSidebar = computed(() => showSidebarState.value);

function changeProject(ev: Event) {
  store.dispatch('auth/changeProject', (ev.target as HTMLSelectElement).value);
}

function onProjectFocus() {
  console.log('Project dropdown focused');
  isProjectDropdownActive.value = true;
}

function onProjectBlur() {
  console.log('Project dropdown blurred');
  // Add a small delay to allow for selection
  setTimeout(() => {
    isProjectDropdownActive.value = false;
  }, 150);
}

function validatePermissions(perm: string): boolean {
  const [resource, name] = perm.split('/');
  const exists = permissions.value.some((p) => p.resourceName === resource && p.name === name);
  return exists;
}

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

// Cleanup event listeners
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('keydown', handleEscape);
  }
});
</script>

<style scoped>
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
