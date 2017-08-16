(function() { 
	"use strict";
	 
	var fileCache = 'dogturf-file-v1';
	
	var fileNames = [
		'/',
		
		'/assets/css/images/ajax-loader.gif',
		'/assets/css/jquery.mobile-1.4.5.min.css',
		'/assets/css/reset.css',
		'/assets/css/style.css',
		
		'/assets/images/find.png',
		'/assets/images/register.png',

		'/assets/js/find.js',
		'/assets/js/global.js',
		'/assets/js/jquery.mobile-1.4.5.min.js',
		'/assets/js/jquery-2.2.4.min.js',
		'/assets/js/localforage.min.js',
		'/assets/js/localforage-getitems.js',
		'/assets/js/localforage-setitems.js',
		'/assets/js/register.js',
		'/assets/js/regsw.js',
		'/assets/js/tv4.js',

		'/pages/find.html',
		'/pages/register.html',
		
		'/schemas/turf.json',
		
		'/turfs'
	]; 

	self.addEventListener('install', function(e) {
		console.log('[ServiceWorker] Install');
		e.waitUntil(caches.open(fileCache).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(fileNames);
		}));
	});

	self.addEventListener('activate', function(e) {
		console.log('[ServiceWorker] Activate');
		e.waitUntil(caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== fileCache) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		}));
		return self.clients.claim();
	});

	self.addEventListener('fetch', function(e) {
		if(e.request.method == "POST") {
			console.log('[Service Worker] Fetch POST', e.request.url);
			e.respondWith(fetch(e.request));
		} else {
			console.log('[Service Worker] Fetch GET', e.request.url);
			e.respondWith(caches.match(e.request).then(function(response) {
				return response || fetch(e.request);
			}));
		}
	});

}());
