const CACHE_NAME = 'matlibras-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/imgs/pwa-192x192.png',
  './assets/imgs/pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => console.log('Fazendo cache dos assets: falhou', err))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache, ou caso não tenha, faz a chamada na rede
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback pra index.html quando offline se for navegação
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
