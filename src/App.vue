<template>
  <div class="bg-[#EDF5FF]">
    <Notifications />
    <!-- Dark overlay -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black opacity-50 z-30"
      @click="toggleSidebar"
      @keydown="toggleSidebar"
    ></div>
    <!-- menu -->
    <div
      v-click-outside="clickOutside"
      class="
        w-full fixed
        z-40
        -mt-2
        mb-8
      "
    >
      <NavBar/>
      <!-- sidebar -->
      <Sidebar />
    </div>
    <!-- content -->
    <div
      class="pt-16"
      :class="{
        'blocker': showSidebar,
      }"
    >
      <router-view />
    </div>
    <!-- footer -->
    <footer class="bg-[#0A77F3] text-white font-alexandria p-20">
      <div class="container flex flex-row w-[75%] mx-auto">
        <!--div azul-->
        <div class="flex-1 flex flex-col pt-4">
          <img src="/dgsky-logo-white.svg" alt="sky logo" class="w-24 mb-4">
          <p class="text-lg font-semibold">A digital experience from Digi Apps. </p>
          <p class="text-md font-light mb-10">Simple. Safe. Always with you.</p>
          <p clas="text-sm font-light">&copy; 2024 digi-storage. Alll rights reserved.</p>
        </div>
        <!--div rojo-->
        <div class="flex-1 mx-auto pt-8 px-4 flex flex-row gap-24">
        <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Products</h3>
        <ul class="space-y-2 text-white/70 text-sm">
          <li><a
            href="#"
            class="hover:text-white/100 hover:font-semibold">Sky</a></li>
          <li><a
            href="#"
            class="hover:text-white/100 hover:font-semibold">Fireweb</a></li>
          <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">DigiCare</a></li>
        </ul>
        </div>
      <!-- Help -->
    <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Help</h3>
        <ul class="space-y-2 text-white/70 text-sm">
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Help Center</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Contact Us</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Vulnerability Reward Programme</a></li>
      </ul>
    </div>
    <!-- Legal -->
    <div class="flex-1">
        <h3 class="text-md text-white font-bold mb-4">Legal</h3>
        <ul class="space-y-2 text-white/70 text-sm">
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Terms of Service</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Privacy Policy</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Transparency Report</a></li>
        <li><a
          href="#"
            class="hover:text-white/100 hover:font-semibold">Copyright notice</a></li>
        <li><a
        href="#"
          class="hover:text-white/100 hover:font-semibold">Submission</a></li>
      </ul>
    </div>
    </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useStore } from 'vuex';

const NavBar = defineAsyncComponent(() => import('./components/global/nav-bar.vue'));
const Sidebar = defineAsyncComponent(() => import('@/components/global/sidebar.vue'));
const Notifications = defineAsyncComponent(() => import('@/components/global/notifications.vue'));

const store = useStore();

const showSidebar = computed(() => store.state.sidebar);

function clickOutside() {
  if (showSidebar.value) store.commit('toggleSidebar');
}

function toggleSidebar() {
  store.commit('toggleSidebar');
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
