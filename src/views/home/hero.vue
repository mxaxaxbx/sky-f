<template>
  <section class="hero-shell">
    <div class="hero-inner">
      <div class="hero-copy">
        <h1>
          Store, share, and move work forward.
        </h1>

        <p>
          Keep your files, folders, and ideas secure in one private workspace built for fast access anywhere.
        </p>

        <div class="hero-actions">
          <a href="/app" class="primary-btn">Get started</a>
          <a href="/app" class="secondary-btn">Open workspace</a>
        </div>

        <div class="hero-points">
          <span>Fast sync</span>
          <span>Private sharing</span>
          <span>Anywhere access</span>
        </div>
      </div>

      <div class="hero-visual" aria-label="Storage workspace preview">
        <div class="dashboard-card">
          <div class="card-header">
            <span class="dot dot-red" />
            <span class="dot dot-yellow" />
            <span class="dot dot-green" />
          </div>

          <div class="folder-row">
            <div class="folder folder-blue">
              <span>Design</span>
            </div>
            <div class="folder folder-soft">
              <span>Photos</span>
            </div>
            <div class="folder folder-soft">
              <span>Docs</span>
            </div>
          </div>

          <div class="file-grid">
            <div class="file-pill file-primary">Brief.pdf</div>
            <div class="file-pill file-muted">Assets</div>
            <div class="file-pill file-muted">Backup</div>
            <div class="file-pill file-primary">Campaign.zip</div>
          </div>

          <div class="metrics-row">
            <div class="metric-box">
              <strong>2.4 TB</strong>
              <span>Storage</span>
            </div>
            <div class="metric-box">
              <strong>1.8k</strong>
              <span>Files</span>
            </div>
            <div class="metric-box accent">
              <strong>99.9%</strong>
              <span>Secure</span>
            </div>
          </div>
        </div>

        <div class="floating-pill pill-top">secure share</div>
        <div class="floating-pill pill-bottom">live sync</div>
        <div class="floating-ring" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLight = computed(() => store.state.theme.theme === 'light');
</script>

<style scoped>
.hero-shell {
  position: relative;
  padding: 4rem 1.5rem 2.5rem;
  background: transparent;
}

.hero-inner {
  position: relative;
  max-width: 1260px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 3rem;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(3rem, 5vw, 6rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
  font-weight: 800;
  color: var(--text);
}

.hero-copy h1::after {
  content: ' storage';
  color: var(--color-primary);
}

.hero-copy p {
  max-width: 38rem;
  margin-top: 1.5rem;
  font-size: clamp(1.03rem, 1.7vw, 1.35rem);
  line-height: 1.7;
  color: var(--text-secondary);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.25rem;
  padding: 0.85rem 1.4rem;
  border-radius: 9999px;
  font-weight: 700;
  transition: all 180ms ease;
}

.primary-btn {
  background: linear-gradient(135deg, var(--color-primary), #5ea8ff);
  color: white;
  box-shadow: 0 18px 36px rgba(10, 119, 243, 0.24);
}

.primary-btn:hover,
.primary-btn:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 22px 40px rgba(10, 119, 243, 0.28);
}

.secondary-btn {
  background: rgba(10, 119, 243, 0.08);
  border: 1px solid rgba(10, 119, 243, 0.18);
  color: var(--text);
}

.secondary-btn:hover,
.secondary-btn:focus-visible {
  background: rgba(10, 119, 243, 0.12);
  border-color: rgba(10, 119, 243, 0.28);
}

.hero-points {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.6rem;
}

.hero-points span {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-secondary);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32rem;
}

.dashboard-card {
  position: relative;
  width: min(100%, 36rem);
  border-radius: 1.7rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  box-shadow: 0 28px 80px rgba(10, 25, 45, 0.28);
  backdrop-filter: blur(16px);
  padding: 1.1rem 1.1rem 1.25rem;
  transform: rotate(-4deg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.2rem 1rem;
}

.dot {
  width: 0.7rem;
  height: 0.7rem;
  display: inline-block;
  border-radius: 50%;
}

.dot-red { background: #ff6b6b; }
.dot-yellow { background: #ffd166; }
.dot-green { background: #4ade80; }

.folder-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1.2rem;
}

.folder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4.5rem;
  border-radius: 1.1rem;
  font-weight: 700;
  color: var(--text);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.folder-blue {
  background: linear-gradient(135deg, rgba(10, 119, 243, 0.26), rgba(10, 119, 243, 0.08));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.folder-soft {
  background: rgba(255, 255, 255, 0.04);
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.file-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.3rem;
  border-radius: 0.95rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.file-primary {
  background: rgba(10, 119, 243, 0.13);
  color: var(--text);
}

.file-muted {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.metric-box {
  padding: 0.9rem 0.8rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.32);
  border: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.metric-box strong {
  color: var(--text);
  font-size: 1.1rem;
  line-height: 1;
}

.metric-box span {
  color: var(--text-terceary);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.metric-box.accent {
  background: linear-gradient(135deg, rgba(10, 119, 243, 0.2), rgba(96, 165, 250, 0.08));
}

.floating-pill {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.3rem;
  padding: 0.5rem 0.8rem;
  border-radius: 9999px;
  border: 1px solid rgba(96, 165, 250, 0.35);
  background: rgba(10, 119, 243, 0.12);
  color: var(--text);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.64rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 28px rgba(10, 119, 243, 0.12);
}

.pill-top {
  top: 3.5rem;
  right: 0.5rem;
  transform: rotate(10deg);
}

.pill-bottom {
  bottom: 2rem;
  left: 0.5rem;
  transform: rotate(-11deg);
}

.floating-ring {
  position: absolute;
  width: 19rem;
  height: 19rem;
  border-radius: 50%;
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: inset 0 0 28px rgba(96, 165, 250, 0.08), 0 0 36px rgba(10, 119, 243, 0.08);
  right: -1rem;
  bottom: -2rem;
  pointer-events: none;
}

@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-copy p {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-points {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .hero-shell {
    padding-top: 3rem;
  }

  .dashboard-card {
    transform: none;
  }

  .floating-pill {
    display: none;
  }
}
</style>
