(function () {
	"use strict";

	var pos = {};
	var schema = null;
	
	function getSchema() {
		fetch('/schemas/turf.json').then(function(response) {
			response.json().then(function(json) {
				schema = json;
			}).catch(function() {
				handleSchemaError("error in reading the response");
			});
		}).catch(function() {
			handleSchemaError("error in the request");
		});
	}

	function getUserPos() {
		if('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(onUserPosSuccess, function() { handleError('Error: The Geolocation service failed.'); });
		} else {
			handleError('Error: Your browser doesn\'t support geolocation.');
		}
	}

	function handleError(message) {
		alert(message);
	}
	
	function handleSchemaError(message) {
		handleError("Could not load the validation schema. There was an " + message + ".");
	}
		
	function init() {
		initControls();
		getSchema();
		getUserPos();
	}

	function initControls() {
		$('form').on("submit", onFormSubmit);
		$('input[type=button]').click(function() { location.href = "/"; });
	}
	
	function onFormSubmit(e) {
		e.preventDefault();
		if(!schema) {
			alert("The validation schema is missing. Unable to validate the data.");
			return;
		}
		var body = {
			"description": $('textarea').val(),
			"official": $('#checkbox-v-2a')[0].checked,
			"leash":  $('#checkbox-v-2b')[0].checked,
			"enclosed":  $('#checkbox-v-2c')[0].checked,
			"lat": pos.lat,
			"lng": pos.lng,
			"valid": false
		};
		if(!tv4.validate(body, schema)) {
			alert(JSON.stringify(tv4.error, null, "  "));
			return;
		}
		body = JSON.stringify(body);
		window.turfs.post('/turfs', body, onResponseSuccess, function() {
			alert("Thank you for adding this turf!\n\nNote: Could not send the turf now but it's added to the queue...\n\nNote: Your turf will be visible after a review.");	
			window.turfs.cacheTurf(body);
			location.href = "/"; 		
		});
	}
	
	function onResponseSuccess(response) {
		if(response.ok) {
			alert("Thank you for adding this turf!\n\nNote: Your turf will be visible after a review.");
			location.href = "/"; 
		} else {
			var general = "Error in the response. " + response.status + " " + response.statusText;
			try {
				response.json().then(function(json) {
					handleError(general + "\n\n" + JSON.stringify(json, null, "  "));
				}).catch(function() { alert(general); });
			} catch(e) {
				handleError(general); 
			}		
		}
	}

	function onUserPosSuccess(position) {
		pos = { 
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		$('input[type=submit]').button('enable');
		$('input[type=checkbox]').checkboxradio('enable');
		$('textarea').textinput('enable').text('').attr('placeholder', 'Enter your description...');
	}

	$(init);	
}());