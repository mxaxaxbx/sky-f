<template>
  <div class="home-shell">
    <div class="home-beam home-beam-left" />
    <div class="home-beam home-beam-right" />
    <div class="home-grid" />
    <div class="home-noise" />

    <main class="home-content">
      <heroSection />
      <featuresSection />
      <mapSection />
    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const heroSection = defineAsyncComponent(() => import('./hero.vue'));
const featuresSection = defineAsyncComponent(() => import('./features.vue'));
const mapSection = defineAsyncComponent(() => import('./map.vue'));
</script>

<style scoped>
.home-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(10, 119, 243, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(10, 119, 243, 0.04), transparent 18%),
    var(--bg);
}

.home-beam {
  position: absolute;
  inset: auto;
  width: 36rem;
  height: 36rem;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
}

.home-beam-left {
  top: -10rem;
  left: -8rem;
  background: rgba(10, 119, 243, 0.35);
}

.home-beam-right {
  right: -8rem;
  top: 8rem;
  background: rgba(143, 193, 255, 0.2);
}

.home-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at center, black 42%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 42%, transparent 100%);
  z-index: 0;
}

.home-noise {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 0.7px, transparent 0.7px);
  background-size: 12px 12px;
  mix-blend-mode: soft-light;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.home-content {
  position: relative;
  z-index: 1;
}

:deep(section) {
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .home-shell {
    background:
      radial-gradient(circle at top, rgba(10, 119, 243, 0.22), transparent 28%),
      var(--bg);
  }

  .home-beam {
    width: 18rem;
    height: 18rem;
    filter: blur(64px);
  }
}
</style>
