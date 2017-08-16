
(function() {
	"use strict";
	var ZOOM = 8;
	var HOWEST = {lat: 51.192, lng: 3.213};
	var map, infoWindow, markers;

	function getTurfs() {
		fetch('/turfs?valid=true').then(function(response) {
			response.json().then(function(json) {
				loadTurfs(json);
			}).catch(function(e) {
				alert('Error in processing the turfs response.');
				console.log("Error in processing the response", e);
			});
		}).catch(function(e) {
			alert('Error requesting the turfs.');
			console.log("Error in processing the request", e);		
		});
	}
	
	function handleLocationError(browserHasGeolocation, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
		infoWindow.open(map);
	}

	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), { center: HOWEST, zoom: ZOOM });
		infoWindow = new google.maps.InfoWindow;
		setUserPos();
		getTurfs();
	}

	function loadTurfs(turfs) {
		markers = turfs.map(function(turf, i) {
			var pos = {lat: turf.lat, lng: turf.lng};

			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				title: turf.description
			});
			marker.turf = turf;
			marker.addListener('click', function(e) {
				infoWindow.setPosition(pos);
				infoWindow.setContent('Description: "' + turf.description + '"<br>' 
					+ '<style>b{font-weight:bold}ul{margin-top:10px}li{list-style:circle inside;}</style>'
					+ '<ul>'
						+ '<li>' + (turf.official ? 'Official dog place' : '<b>Unofficial!</b>') + '</li>'
						+ '<li>' + (turf.leash ? '<b>Leash obligated!</b>' : 'No leash obligated') + '</li>'
						+ '<li>' + (turf.enclosed ? 'Enclosed' : '<b>Not enclosed!</b>') + '</li>'
					+ '</ul>'
				);
				infoWindow.open(map);
				map.setCenter(marker.getPosition());
			});
			return marker;
		});
	}
	
	
	function onUserPosError() {
		handleLocationError(true, map.getCenter());	
	}

	function onUserPosSuccess(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		infoWindow.setPosition(pos);
		infoWindow.setContent('You.');
		infoWindow.open(map);
		map.setCenter(pos);
	}

	function setUserPos() {
		if('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(onUserPosSuccess, onUserPosError);
		} else {
			handleLocationError(false, map.getCenter());
		}
	}

	window.initMap = initMap;

}());