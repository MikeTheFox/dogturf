
# [DogTurf](https://dogturf.node2.be/)

* [GitHub repository](https://github.com/MikeTheFox/dogturf).
* [Online version](https://dogturf.node2.be/) _that might go offline_.

### Install and run notes

##### Install

Use Node Package Manager to install the server packages.

* To do so go open a command prompt, 
* go to the folder with the "packages.json" file and
* enter ```npm install``` .

##### Run

* On Windows use the command line `node app.js [port]`.
* On Linux use the command line `[sudo] nodejs app.js [port]`.

_**(Note: Using "json-server" will disable server side data validation.)**_

##### Configure HTTPS

You can turn https on and off, and change the key locations, in the config.js file. 
```
module.exports = {
	https: false,
	key: "/etc/letsencrypt/live/example.com/privkey.pem",
	cert: "/etc/letsencrypt/live/example.com/fullchain.pem"
};
```

### About

##### Functionality

* find
  * browse map nearby
  * offline list (todo)
  * rate turf (todo)

* register
  * officialy dog only?
  * dogs can run free?
  * enclosed?
  * coordinates
  * description

##### Features

* Progressive Web App (full screen when installed on mobile).
* Caching of application files.
* Caching, queueing and retrying of failed posts.
* Google Maps API.
* GEO Location API.
* Client and server side data validation with JSON schema's.
* HTTPS capable.

##### Notes 

* Noticed, while testing, that the desktop version has no position when offline .
* Noticed that the Geo Location sometimes takes long.
* Noticed that the Map API still "partially" works when it's in the cache.

##### Tested on

* Chrome v59.0 Android.
* Chrome v60.0 Windows desktop.
* Edge Windows desktop.

##### Todo

* Nicer feedback messages of schema validation
* Nicer dialogs for messages
* Validate the content type of the http request on the server side.
* Test on: iPhone, iOS, , firefox windows desktop, ...
* Change getCurrentPosition with watchPosition if there's a "fix" indicator in the API.
* ??? Cache last position up to ??? seconds because when going to the register page the Geo Location goes fast the first time.
* ??? Cache responses of other domains ??? (Can't store all Google Maps images...)
