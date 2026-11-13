<template>
  <section class="features-shell">
    <div class="features-header">
      <div class="eyebrow">Built for content that matters</div>
      <h2>
        A private cloud that keeps work moving.
      </h2>
      <p>
        From documents and media to shared projects, everything stays organized, secure, and instantly accessible.
      </p>
    </div>

    <div class="features-grid">
      <article class="feature-card feature-main">
        <div class="feature-icon">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M49 22.5c-1.3-8.9-8.7-15.5-17.7-15.5-8.9 0-16.6 6.3-17.6 15.1C6.2 23.4 2 28.5 2 35c0 7.7 6.3 14 14 14h32c7.7 0 14-6.3 14-14 0-6.7-4.8-12.2-13-12.5Z" fill="rgba(10,119,243,0.18)"/>
            <path d="M21 29.5V48.5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V29.5" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25 29.5h14l-7-9-7 9Z" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="feature-copy">
          <h3>Secure storage</h3>
          <p>
            Protect every file with a workspace designed for trust, privacy, and easy access when you need it.
          </p>
        </div>

        <ul>
          <li>Encrypted by default</li>
          <li>Fast upload and restore</li>
          <li>Always available</li>
        </ul>
      </article>

      <article class="feature-card">
        <div class="feature-icon small">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <rect x="14" y="18" width="36" height="30" rx="6" fill="rgba(10,119,243,0.12)" stroke="var(--color-primary)" stroke-width="3"/>
            <path d="M23 28h18M23 36h18M23 44h12" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"/>
            <path d="M48 24v8h-8" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="feature-copy">
          <h3>Organized files</h3>
          <p>
            Group work by project, folder, and priority so content stays clear and easy to find.
          </p>
        </div>
      </article>

      <article class="feature-card">
        <div class="feature-icon small">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="18" fill="rgba(10,119,243,0.12)" stroke="var(--color-primary)" stroke-width="3"/>
            <path d="M32 18v14l9 6" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M50 32c0 9.9-8.1 18-18 18s-18-8.1-18-18 8.1-18 18-18" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 8"/>
          </svg>
        </div>

        <div class="feature-copy">
          <h3>Always in sync</h3>
          <p>
            Access the latest files from any device and keep every project moving without friction.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.features-shell {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 5rem;
}

.features-header {
  max-width: 44rem;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid rgba(10, 119, 243, 0.22);
  background: rgba(10, 119, 243, 0.08);
  color: var(--color-primary);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.features-header h2 {
  margin: 1rem 0 0.75rem;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
  color: var(--text);
}

.features-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.08rem;
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 1.25rem;
}

.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 22rem;
  border-radius: 1.7rem;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
  padding: 1.5rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  border-color: rgba(10, 119, 243, 0.28);
  box-shadow: 0 22px 45px rgba(10, 119, 243, 0.08);
}

.feature-main {
  background: linear-gradient(180deg, rgba(10, 119, 243, 0.1), rgba(255,255,255,0.02));
}

.feature-icon {
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.2rem;
  background: rgba(10, 119, 243, 0.08);
  border: 1px solid rgba(10, 119, 243, 0.18);
}

.feature-icon.small {
  width: 4rem;
  height: 4rem;
}

.feature-icon svg {
  width: 2.4rem;
  height: 2.4rem;
}

.feature-copy {
  margin-top: 1.2rem;
}

.feature-copy h3 {
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.05em;
  color: var(--text);
}

.feature-copy p {
  margin: 0.8rem 0 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

.feature-card ul {
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.feature-card li {
  position: relative;
  padding-left: 1.2rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.feature-card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 18px rgba(10, 119, 243, 0.45);
}

@media (max-width: 980px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: unset;
  }
}
</style>
