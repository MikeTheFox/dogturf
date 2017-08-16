
var config = require('./config');

var fs = require('fs'),
	http = config.https ? require('https') : require('http'),
	jsonServer = require('json-server'),
	bodyParser = require('body-parser'),
	server = jsonServer.create(),
	router = jsonServer.router('db.json'),
	schemas = require("./schemas"),
	middlewares = jsonServer.defaults(),
	port = process.argv.length <= 2 ? (config.https ? 443 : 80) : process.argv[2];


// Options for security reasons...

server.use(function(req, res, next) {
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("X-XSS-Protection", "1; mode=block");
	res.setHeader("X-Content-Type-Options", "nosniff");
	return next();
});

server.use(middlewares);
server.use(bodyParser.json());
server.use(schemas);
server.use(router);

var serverStarted = function() {
	console.log("json-server started on port " + port);
};

if( config.https ) {
	var options = {
		key: fs.readFileSync(config.key),
		cert: fs.readFileSync(config.cert)
	};
	http.createServer(options, server).listen(port, serverStarted);
} else {
	http.createServer(server).listen(port, serverStarted);
}