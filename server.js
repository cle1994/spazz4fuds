var express             = require('express');
var bodyParser          = require('body-parser');
var mongoose            = require('mongoose');
var shortId             = require('shortid');
var methodOverride      = require('method-override');
var app                 = express(); //create server

// Port
var port = process.env.PORT || 8080;
// Mongodb
mongoose.connect('mongodb://localhost/spazz4fudz');

// Static files
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());

// Bodyparser/Json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


// Router
// Backend routes
var router = express.Router();
require('./app/routes.js')(app, router);

//start
app.listen(port);
console.log('Server Running');
