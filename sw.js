const staticCacheName = 'site-static-v5';
const dynamicCacheName = 'site-dynamic-v5';

const assets = [
  '/', 
  '/index.html',
  '/js/app.js', 
  '/js/ui.js', 
  '/js/materialize.min.js',
  '/css/styles.css', 
  '/css/materialize.min.css',
  '/img/dish.png', 
  '/public/img/dish.png',
  './public/profil.png', 
  './manifest.json',
  '/pages/fallback.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

// Limite la taille du cache dynamique
const limitCacheSize = (name, size = 100) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

// Installation
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(assets))
      .catch(err => console.error('Erreur mise en cache initiale:', err))
  );
});

// Activation
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch avec stratégies intelligentes
self.addEventListener('fetch', evt => {
  const { request } = evt;
  const url = new URL(request.url);



    // 🚫 Désactiver SW COMPLETEMENT pour cette API
  if (url.pathname.startsWith('/changer-appareil-compte-api/')) {
    evt.respondWith(fetch(request)); 
    return;
  }


  // Ignorer les appels Firestore
  if (url.origin.includes('firestore.googleapis.com')) return;

  // Cache First : images, polices, css
  if (
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    evt.respondWith(
      caches.match(request).then(cacheRes => {
        return (
          cacheRes ||
          fetch(request).then(fetchRes => {
            return caches.open(staticCacheName).then(cache => {
              cache.put(request.url, fetchRes.clone());
              return fetchRes;
            });
          }).catch(() => {
            if (request.destination === 'image') {
              return caches.match('/img/fallback.png');
            }
          })
        );
      })
    );
    return;
  }

  // Stale-While-Revalidate : HTML, JS
  if (
    request.destination === 'document' ||
    request.destination === 'script'
  ) {
    evt.respondWith(
      caches.match(request).then(cacheRes => {
        const fetchPromise = fetch(request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName);
            return fetchRes;
          });
        }).catch(() => {
          if (request.destination === 'document') {
            return caches.match('/pages/fallback.html');
          }
        });

        return cacheRes || fetchPromise;
      })
    );
    return;
  }

  // Par défaut : Network First
  evt.respondWith(
    fetch(request).then(fetchRes => {
      return caches.open(dynamicCacheName).then(cache => {
        cache.put(request.url, fetchRes.clone());
        limitCacheSize(dynamicCacheName);
        return fetchRes;
      });
    }).catch(() => caches.match(request))
  );
});









