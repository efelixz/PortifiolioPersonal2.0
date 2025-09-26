const CACHE_NAME = 'jefferson-portfolio-v2.0.0';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const AI_CACHE = 'ai-responses-v1';
const MODELS_3D_CACHE = '3d-models-v1';
const ANALYTICS_CACHE = 'analytics-v1';
const OFFLINE_URL = '/offline.html';

// Assets essenciais para cache offline
const STATIC_CACHE_URLS = [
  '/',
  '/projetos',
  '/contato',
  '/demos',
  '/sobre',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg',
  '/robots.txt',
  '/404.html'
];

// Assets de funcionalidades avançadas
const ADVANCED_FEATURES_URLS = [
  '/assets/models/', // Modelos 3D
  '/assets/animations/', // Animações
  '/assets/ai/', // Recursos de IA
  '/assets/ar/' // Recursos de AR
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First - para assets estáticos
  CACHE_FIRST: 'cache-first',
  // Network First - para conteúdo dinâmico
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - para recursos que podem ser atualizados
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      self.skipWaiting()
    ])
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => {
              console.log('Service Worker: Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Só interceptar requisições HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;

  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para navegação (páginas)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache da página visitada
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Se offline, retornar página em cache ou página offline
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Estratégia para assets estáticos (JS, CSS, imagens)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Cache hit - retornar do cache e atualizar em background
            fetch(request)
              .then((response) => {
                if (response.ok) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(request, responseClone);
                    });
                }
              })
              .catch(() => {
                // Falha na rede, mas temos cache
              });
            return cachedResponse;
          }

          // Cache miss - buscar na rede e cachear
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // Estratégia padrão para outras requisições
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background Sync (quando voltar online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // Aqui você pode implementar sincronização de dados
      // Por exemplo, enviar formulários que falharam offline
      syncPendingData()
    );
  }
});

// Push Notifications (opcional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Click em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let notificationData = {
    title: 'Portfolio Update',
    body: 'Nova atualização disponível!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'portfolio-update'
  };

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Date.now(),
      url: notificationData.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver agora',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  if (event.action === 'explore' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        // Verificar se já existe uma janela aberta
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Se não existe, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Background Sync para formulários offline
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Message Handler
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

// Função auxiliar para sincronização
async function syncContactForms() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('contact-form')) {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('Contact form synced successfully');
        } catch (error) {
          console.log('Still offline, will retry later');
        }
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    totalSize += keys.length;
  }
  
  return totalSize;
}