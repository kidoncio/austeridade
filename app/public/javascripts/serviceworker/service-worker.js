var CACHE_NAME = 'v0.0.0';
var offlineFundamentals = [
    '/',
    '/fonts/',
    '/javascripts/detectmobilebrowser.js',
    '/javascripts/html5shiv.js',
    '/javascripts/jquery.easing.1.3.js',
    '/javascripts/jquery.nicescroll.min.js',
    '/javascripts/main.js',
    '/javascripts/common.js',
    '/javascripts/wow.min.js',
    '/stylesheets/main.css',
    '/stylesheets/normalize.css',
    '/stylesheets/responsive.css',
    '/stylesheets/animate.min.css',
    '/stylesheets/colors/color9.css',
    '/libs/materialize/js/materialize.min.js',
    '/libs/materialize/css/materialize.min.css',
    '/images/brasilia.jpg',
    '/images/austeridade.png',
    'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
    '/manifest.json'
];

self.addEventListener('install', function installer (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function prefill (cache) {
                cache.addAll(offlineFundamentals);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});