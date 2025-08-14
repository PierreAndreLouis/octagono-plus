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







// const staticCacheName = 'site-static-v4';
// const dynamicCacheName = 'site-dynamic-v4';

// const assets = [
//   '/',
//   '/index.html',
//   '/js/app.js',
//   '/js/ui.js',
//   '/js/materialize.min.js',
//   '/css/styles.css',
//   '/css/materialize.min.css',
//   '/img/dish.png',
//   '/public/img/dish.png',
//   '../assets/img/dish.png',
//   'https://fonts.googleapis.com/icon?family=Material+Icons',
//   'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
//   '/pages/fallback.html',

//   './public/profil.png',  
//   './manifest.json',

//   'img/*.png',
//   'img/cars/*.png',
//   'img/carte/*.png',
//   'img/icons/*.png',
//   'img/logo/*.png',
//   'img/home_icon/*.png',
//   'pin/*.png',

//   'img/screenshot/*.png',
//   'img/screenshot/ajouter_nouveau_appareil/*.png',
//   'img/screenshot/localisation/*.png',
//   'img/screenshot/modifier_ou_supprimer/*.png',
//   'img/screenshot/trajet/*.png',
// ];

// // Limite la taille du cache dynamique
// const limitCacheSize = (name, size = 100) => {
//   caches.open(name).then((cache) => {
//     cache.keys().then((keys) => {
//       if (keys.length > size) {
//         cache.delete(keys[0]).then(() => limitCacheSize(name, size));
//       }
//     });
//   });
// };

// // Installation - mise en cache des ressources statiques
// self.addEventListener('install', (evt) => {
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log('Mise en cache des ressources statiques');
//       return cache.addAll(assets);
//     }).catch((err) => {
//       console.error('Erreur lors de la mise en cache des ressources statiques :', err);
//     })
//   );
// });

// // Activation - nettoyage des anciens caches
// self.addEventListener('activate', (evt) => {
//   evt.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys
//           .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
//           .map((key) => caches.delete(key))
//       );
//     }).catch((err) => {
//       console.error('Erreur lors de la suppression des anciens caches :', err);
//     })
//   );
// });

// // Récupération - stratégie Network First
// self.addEventListener('fetch', (evt) => {
//   if (evt.request.method !== 'GET' || evt.request.url.indexOf('firestore.googleapis.com') > -1) return;

//   evt.respondWith(
//     fetch(evt.request)
//       .then((fetchRes) => {
//         // Réponse OK ? On la met en cache et on la retourne
//         return caches.open(dynamicCacheName).then((cache) => {
//           cache.put(evt.request.url, fetchRes.clone());
//           limitCacheSize(dynamicCacheName, 100);
//           return fetchRes;
//         });
//       })
//       .catch(() => {
//         // En cas d'échec réseau, on retourne le cache si disponible
//         return caches.match(evt.request).then((cacheRes) => {
//           if (cacheRes) return cacheRes;

//           if (evt.request.headers.get('accept').includes('text/html')) {
//             return caches.match('/pages/fallback.html');
//           }

//           // Optionnel : image de secours si le fichier est une image
//           if (evt.request.destination === 'image') {
//             return caches.match('/img/fallback.png');
//           }

//           return new Response('', { status: 503, statusText: 'Service Unavailable' });
//         });
//       })
//   );
// });















// const staticCacheName = 'site-static-v4';
// const dynamicCacheName = 'site-dynamic-v4';
// const assets = [
//   '/',
//   '/index.html',
//   '/js/app.js',
//   '/js/ui.js',
//   '/js/materialize.min.js',
//   '/css/styles.css',
//   '/css/materialize.min.css',
//   '/img/dish.png',
//   '/public/img/dish.png',
//   '../assets/img/dish.png',
//   'https://fonts.googleapis.com/icon?family=Material+Icons',
//   'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
//   '/pages/fallback.html',

//   './public/profil.png',  
//   './manifest.json',


//   'img/*.png',
//   'img/cars/*.png',
//   'img/carte/*.png',
//   'img/icons/*.png',
//   'img/logo/*.png',
//   'img/home_icon/*.png',
//   'pin/*.png',
  
//   'img/screenshot/*.png',
//   'img/screenshot/ajouter_nouveau_appareil/*.png',
//   'img/screenshot/localisation/*.png',
//   'img/screenshot/modifier_ou_supprimer/*.png',
//   'img/screenshot/trajet/*.png',




// ];




// // Limite de taille pour le cache dynamique
// const limitCacheSize = (name, size = 100) => {
//   caches.open(name).then((cache) => {
//     cache.keys().then((keys) => {
//       if (keys.length > size) {
//         cache.delete(keys[0]).then(() => limitCacheSize(name, size));
//       }
//     });
//   });
// };

// // Événement d'installation
// self.addEventListener('install', (evt) => {
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log('Mise en cache des ressources statiques');
//       return cache.addAll(assets);
//     }).catch((err) => {
//       console.error('Erreur lors de la mise en cache des ressources statiques :', err);
//     })
//   );
// });

// // Événement d'activation
// self.addEventListener('activate', (evt) => {
//   evt.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys
//           .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
//           .map((key) => caches.delete(key))
//       );
//     }).catch((err) => {
//       console.error('Erreur lors de la suppression des anciens caches :', err);
//     })
//   );
// });

// // Événement de récupération
// self.addEventListener('fetch', (evt) => {
//   if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
//     evt.respondWith(
//       caches.match(evt.request).then((cacheRes) => {
//         return (
//           cacheRes ||
//           fetch(evt.request)
//             .then((fetchRes) => {
//               return caches.open(dynamicCacheName).then((cache) => {
//                 cache.put(evt.request.url, fetchRes.clone());
//                 limitCacheSize(dynamicCacheName, 100); // Limite de taille dynamique
//                 return fetchRes;
//               });
//             })
//             .catch((err) => {
//               console.error('Erreur lors de la récupération réseau :', err);
//               if (evt.request.url.indexOf('.html') > -1) {
//                 return caches.match('/pages/fallback.html');
//               }
//               return caches.match('/img/fallback.png'); // Retourne une image par défaut
//             })
//         );
//       })
//     );
//   }
// });

