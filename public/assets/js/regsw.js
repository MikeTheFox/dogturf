(function () {
	var worker;
	var interval = null;
	
	if('serviceWorker' in navigator) {
 
		navigator.serviceWorker.register('service-worker.js', {scope: '/'}).then(function(registration) {

			/*
			if(registration.installing){
				console.log('Resolved at installing: ', registration);
				worker = registration.installing;
			}else if(registration.waiting){
				console.log('Resolved at installed/waiting: ', registration);
				worker = registration.waiting;
			}else if(registration.active){
				console.log('Resolved at activated: ', registration);
				worker = registration.active;
			}

			if(worker) {
				worker.addEventListener('statechange', function(e){
					console.log(e.target.state);
				});
			}

			registration.addEventListener('updatefound', function(e) {
				registration.installing.addEventListener('statechange', function(e) {
					console.log('New service worker state: ', e.target.state);
				});
				console.log('New service worker found!', registration);
			});
			*/

			if(!interval) {
				interval = setInterval(function() {
					registration.update();
				}, 5000);
			}
			
		}).catch(function(error) {
			console.log('Error occurred', error);
		});

		navigator.serviceWorker.addEventListener('controllerchange', function(e) {
			console.log('Controller Changed!');
		});
	}
}());
