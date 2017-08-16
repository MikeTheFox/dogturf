/*
	OK = 200;
	CREATED = 201;
	NO_CONTENT = 204;

	UNAUTHORIZED = 401;
	NOT_FOUND = 404;
	NOT_ALLOWED = 405;
	CONFLICT = 409;
	UNSUPPORTED_MEDIA_TYPE = 415;
	CECI_N_EST_PAS_UN_SERVEUR = 418;
	ENHANCE_YOUR_CALM = 420;
	UNPROCESSABLE_ENTITY = 422;

	INTERNAL_SERVER_ERROR = 500;
*/

var jsonschema = require('jsonschema');
var Validator = jsonschema.Validator;
var path = require("path");
var url = require("url");
var fs = require('fs');

var end = function (res, status, body) {
	res.writeHead(status, {"Content-Type": "application/json"});
	res.write(JSON.stringify(body));
	res.end();
};

var methodNotAllowed = function(req, res, next) {
	end(res, 405, {"error": "Method Not Allowed"});
};

var schemas = {
	"turf": JSON.parse(fs.readFileSync('./public/schemas/turf.json'))
};

var validators = {
	"turf": function(req, res, next) {
		var r = new Validator().validate(req.body, schemas.turf);
		if(r.errors.length > 0) {
			end(res, 422, r.errors);
			return;
		}
		console.log("valid");
		return next();
	}
};

var handlers = {
	'POST': {
		'/turfs': function(req, res, next) {
			console.log("POST validation", req.body);
			validators.turf(req, res, next);
		}
	},
	'PATCH': {
		'/turfs': methodNotAllowed
	},
	'DELETE': {
		'/turfs': methodNotAllowed
	},
	'PUT': {
		'/turfs': methodNotAllowed		
	}
};

module.exports = function (req, res, next) {
	try {
		var handler = handlers[req.method];
		if (handler !== undefined) {
			var uri = url.parse(req.url);
			var pathname = '/' + uri.pathname.split('/')[1];
			if(handler[pathname] !== undefined) {
				return handler[pathname](req, res, next);
			}				
		}
		return next();
	} catch(e) {
		console.log("Error in exports", e);
	}
};
