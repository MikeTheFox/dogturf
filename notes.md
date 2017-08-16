
# Notes

### NGINX redirection of port 80 to port 443

* Create subdomain
```
$> sudo nano /etc/nginx/sites-available/dogturf.node2.be
```
* Write and save this to redirect the subdomain.
```
server {
        listen 80;
        server_name dogturf.node2.be;
        return 301 https://$host$request_uri;
}
```
* Create a symbolic link for nginx
* Restart nginx
```
$> sudo ln -s /etc/nginx/sites-available/dogturf.node2.be /etc/nginx/sites-enabled/dogturf.node2.be
$> sudo service nginx stop
$> sudo service nginx start
```

* for more than one redirection of https subdomain see and try:
     https://www.digitalocean.com/community/questions/how-to-setup-nginx-reverse-proxy-for-sub-domain

### let's encrypt HTTPS/SSL support nodejs

* Let's encrypt

https://www.aidanwoods.com/blog/lets-encrypt-the-manual-certificate/

1. remove the sub domain from nginx
```
$> sudo cp /etc/nginx/sites-available/dogturf.node2.be /etc/nginx/sites-available/dogturf.node2.be.bkp
$> sudo rm /etc/nginx/sites-available/dogturf.node2.be
$> sudo rm /etc/nginx/sites-enabled/dogturf.node2.be
$> sudo service nginx stop
$> sudo service nginx start
```

2. install letsencrypt and start handshake
```
$> cd ~/Documents/certs
$> git clone https://github.com/letsencrypt/letsencrypt
$> cd letsencrypt
$> ./letsencrypt-auto certonly --manual
```
(In case of error > ImportError: No module named datetime)
```
$> rm ~/.local/share/letsencrypt -R
$> ./letsencrypt-auto certonly --manual
```
The output, wait to press enter!
```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Please enter in your domain name(s) (comma and/or space separated)  (Enter 'c'
to cancel): dogturf.node2.be
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for dogturf.node2.be

-------------------------------------------------------------------------------
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
-------------------------------------------------------------------------------
(Y)es/(N)o: y

-------------------------------------------------------------------------------
Create a file containing just this data:

W7nZnKQo__cmLAaPslLqRzUVF8Dcwd7UMaefs-nfhfQ.HkQLL2AgqLntAWTVd_x21EoL92yCvyNykS7JE2F2HtQ

And make it available on your web server at this URL:

http://dogturf.node2.be/.well-known/acme-challenge/W7nZnKQo__cmLAaPslLqRzUVF8Dcwd7UMaefs-nfhfQ

-------------------------------------------------------------------------------
Press Enter to Continue
```
3. Follow the instructions. (open another terminal to create certificate file)
```
$> sudo cd /var/www/html/.well-known/acme-challenge/
$> sudo nano W7nZnKQo__cmLAaPslLqRzUVF8Dcwd7UMaefs-nfhfQ
```
Paste and save the date out the other 
```
W7nZnKQo__cmLAaPslLqRzUVF8Dcwd7UMaefs-nfhfQ.HkQLL2AgqLntAWTVd_x21EoL92yCvyNykS7JE2F2HtQ
```

4. go back to previous terminal and press enter, output:
```
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/dogturf.node2.be/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/dogturf.node2.be/privkey.pem
   Your cert will expire on 2017-11-11. To obtain a new or tweaked
   version of this certificate in the future, simply run
   letsencrypt-auto again. To non-interactively renew *all* of your
   certificates, run "letsencrypt-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

5. repair nginx redirection files and restart nginx
```
$> sudo mv /etc/nginx/sites-available/dogturf.node2.be.bkp /etc/nginx/sites-available/dogturf.node2.be
$> sudo ln -s /etc/nginx/sites-available/dogturf.node2.be /etc/nginx/sites-enabled/dogturf.node2.be
$> sudo service nginx stop
$> sudo service nginx start
```

6. test script
```
var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('/etc/letsencrypt/live/dogturf.node2.be/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/dogturf.node2.be/fullchain.pem')
};

https.createServer(options, function (req, res) {
	res.writeHead(200);
	res.end("hello universe!");
}).listen(443);

console.log("listening to port 443");
```

### Sources 

* manifest and images

https://developer.mozilla.org/en-US/docs/Web/Manifest
manifest: http://mwa-project.herokuapp.com/
manifest icons: https://app-manifest.firebaseapp.com/
favicons: http://realfavicongenerator.net/
http://image.online-convert.com/convert-to-svg

* firewall rule

https://help.ubuntu.com/lts/serverguide/firewall.html

* https in nodejs

http://voidcanvas.com/create-ssl-https-server-in-nodejs/

* Let's encrypt error: "ImportError: No module named datetime"

https://askubuntu.com/questions/509283/python-no-module-named-datetime/850669#850669

* json-server, hotel and filltext

https://github.com/typicode/json-server
https://github.com/typicode/hotel
http://www.filltext.com/

* https with json-server(hotel)

https://github.com/typicode/json-server/issues/244

* jquery mobile 

http://demos.jquerymobile.com/1.4.5/checkboxradio-checkbox/#&ui-state=dialog
https://demos.jquerymobile.com/1.2.0/docs/forms/textinputs/methods.html

* service workers

https://developer.mozilla.org/en/docs/Web/API/Service_Worker_API
https://filipbech.github.io/2017/02/service-worker-and-caching-from-other-origins
https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/

* geolocation

https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

* maps api

https://developers.google.com/maps/documentation/javascript/get-api-key?refresh=1
https://developers.google.com/maps/documentation/javascript/adding-a-google-map
https://developers.google.com/maps/documentation/javascript/tutorial
https://developers.google.com/maps/documentation/javascript/reference
https://developers.google.com/maps/documentation/javascript/examples
https://developers.google.com/maps/documentation/javascript/events

* push api

https://developer.mozilla.org/en-US/docs/Web/API/Push_API

* schema validator

http://www.jsonschemavalidator.net/
https://github.com/geraintluff/tv4/
https://github.com/tdegrunt/jsonschema/

* body parser for server side schema validation 

https://stackoverflow.com/questions/9177049/express-js-req-body-undefined

* markdown

https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet/
http://dillinger.io/

