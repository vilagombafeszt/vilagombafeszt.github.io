// Service Worker for GombApp PWA
// Bump CACHE_NAME whenever you change CSS/JS so clients get fresh assets
const CACHE_NAME = 'gombapp-v2';

// Static assets to cache on install
// Note: Icon files (icon-*.png) are not cached as they are placeholders
// Add them to this list once actual icon files are created
const STATIC_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './bartender.html',
  './programs.html',
  './ticketclerk.html',
  './manifest.json',
  './sass/style.css',
  './scripts/login.js',
  './scripts/indexscripts.js',
  './scripts/adminscripts.js',
  './scripts/bartenderscripts.js',
  './scripts/programsscripts.js',
  './scripts/ticketclerk.js',
  './images/adminpic.png',
  './images/bartenderprofilepic.png',
  './images/calendar.png',
  './images/ticketclerk.png',
  './images/stats.png',
  './images/korso-kobi.png',
  './images/pohar-kobi.png',
  './images/kezmuves.png',
  './images/nagyfroccs.png',
  './images/kisfroccs.png',
  './images/hosszulepes.png',
  './images/haziur.png',
  './images/sportfroccs.png',
  './images/kisszoda.png',
  './images/nagyszoda.png',
  './images/kisbor.png',
  './images/nagybor.png',
  './images/palinka.png',
  './images/kave.png',
  './images/jegestea.png',
  './images/pohar.png',
  './images/pass.png',
  './images/ticket.png',
  './images/ticket1.png',
  './images/realtime-calendar.png',
  './images/agenda-calendar.png',
  './images/ebed.png',
  './images/foodserverprofilepic.png',
  './images/koktel.png',
  './images/userprofilepic.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become active
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip cross-origin requests (e.g., Google Fonts, Firebase, etc.)
  if (requestUrl.origin !== location.origin) {
    // Network-first for external resources
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, fetch from network and cache for future
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Failed to cache response:', error);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return offline fallback if available
            return caches.match('./index.html');
          });
      })
  );
});
