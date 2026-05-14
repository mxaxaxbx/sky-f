const CACHE_VERSION = 'sky-pwa-v1';
const SHELL_CACHE = `sky-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sky-runtime-${CACHE_VERSION}`;
const SCOPE_URL = new URL(self.registration.scope);

const assetUrl = (path) => new URL(path, SCOPE_URL).toString();

const APP_SHELL = [
  assetUrl('.'),
  assetUrl('index.html'),
  assetUrl('manifest.webmanifest'),
  assetUrl('favicon.ico'),
  assetUrl('offline.html'),
  assetUrl('icon/icon-logoSky.svg'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('sky-') && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKY_SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(SHELL_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request, { ignoreSearch: true });
    if (cachedResponse) {
      return cachedResponse;
    }

    const offlineResponse = await caches.match(assetUrl('offline.html'));
    if (offlineResponse) {
      return offlineResponse;
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}
