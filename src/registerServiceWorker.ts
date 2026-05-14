export const registerServiceWorker = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  const register = () => {
    const swUrl = `${process.env.BASE_URL}sw.js`;

    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKY_SKIP_WAITING' });
        }
      })
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  };

  if (document.readyState === 'complete') {
    register();
    return;
  }

  window.addEventListener('load', register, { once: true });
};
