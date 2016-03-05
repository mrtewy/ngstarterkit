// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var morgan 		   = require('morgan');             // log requests to the console (express4)


// configuration ===========================================
	
// config files
// var db = require('./server/config/db');

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

app.use(express.static(__dirname + '/dist'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
// no cache on all requests:
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache');
  next();
});

app.get('/', function(req, res){ 
	console.log(__dirname);
});
// routes ==================================================
// pass our application into our routes
var routes = require('./src/server/routes'); 
routes(app);

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user