// Stolen from https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html
// TODO: tweak this and add an 'must be used online' message

var CACHE = '%name%-cache';
self.addEventListener('install', function(evt) {
  evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      '/index.md',
      '/css/page.css',
      '/css/prism.css',
      '/js/prism.js'
    ])
    .then(function() {
      console.log('[install] All required resources have been cached, ' +'we\'re good!');
        return self.skipWaiting();
      })
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}
