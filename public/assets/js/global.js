(function() {
	"use strict";

	var turfDB = localforage.createInstance({name: "TurfDB"});
	
	// Note: turf is a JSON string
	function cacheTurf(turf) {
		turfDB.setItem("turf" + Date.now(), turf);
		turfDB.keys().then(function(keys) {
			console.log("Cached turf", keys.length);
		});
	}

	function checkOnline() {
		if(navigator.onLine) {
			turfDB.keys().then(function(keys) {
				for(var i = 0; i < keys.length; i++) {
					postCachedTurf(keys[i]);
				}
			});
		}
	}
	
	// Note: body is a JSON string
	function post(url, body, onSuccess, onError) {
		var options = {
			body: body,
			headers: {
				'Accept': 'application/json, text/plain, */*', 
				'Content-Type': 'application/json'
			},
			method: "POST"
		};
		fetch(url, options).then(onSuccess || function(){}).catch(onError || function(){});
	}

	function postCachedTurf(key) {
		turfDB.getItem(key).then(function(turf) {
			post('/turfs', turf, function(response) {
				turfDB.removeItem(key, function(){
					console.log('Succesfully fetched and removed a stored turf' + key);
				});
			}, function(e) {
				console.log('Error while fetching offline turf ', e);		
			});						
		});;	
	}
	
	window.turfs = { 
		post: post, 
		cacheTurf: cacheTurf 
	};
	
	window.setInterval(checkOnline, 5000);
	
}());