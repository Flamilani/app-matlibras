const CACHE_NAME = 'matlibras-pwa-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/imgs/pwa-192x192.png',
  './assets/imgs/pwa-512x512.png',
  './manifest.json'
];

// Instala o SW e pré-cacheia apenas os assets estáticos conhecidos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto');
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => console.log('Pré-cache falhou:', err))
  );
  // Força o SW novo a ativar imediatamente sem esperar as abas fecharem
  self.skipWaiting();
});

// Ativa e limpa caches antigos imediatamente
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => {
      // Toma controle de todas as abas imediatamente
      return self.clients.claim();
    })
  );
});

// Estratégia: Network First para HTML e assets com hash, Cache First para imagens
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET e requisições externas (ex: Clerk, APIs)
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Network First para navegação (HTML) e JS/CSS do Vite (têm hash no nome)
  if (
    request.mode === 'navigate' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Armazena a resposta nova no cache
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Se a rede falhar, tenta o cache (modo offline)
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Cache First para imagens e outros assets estáticos
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return networkResponse;
      });
    }).catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
