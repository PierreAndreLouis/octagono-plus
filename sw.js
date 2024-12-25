const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
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
  '../assets/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html',

  './public/profil.png',  // Ajoute l'icône ici
  './manifest.json',


  'img/*.png',
  'img/cars/*.png',
  'img/carte/*.png',
  'img/icons/*.png',
  'img/logo/*.png',
  'img/home_icon/*.png',
  'pin/*.png',



  // '/public/img/*.png',
  // '/public/img/cars/*.png',
  // '/public/img/carte/*.png',
  // '/public/img/icons/*.png',
  // '/public/img/logo/*.png',
  // '/public/img/home_icon/*.png',
  // '/public/pin/*.png',


];

// cache size limit function
const limitCacheSize = (name, size = 50) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          });
        });
      }).catch(() => {
    // dans sw.js
if (evt.request.url.indexOf('.html') > -1) {
  return caches.match('./fallback.html'); // Assurez-vous que le chemin est correct
}

      })
    );
  }
});
