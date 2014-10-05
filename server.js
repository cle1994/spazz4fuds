// server.js

// modules -----------
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

// routes ------------
require('./app/routes')(app);

console.log('Magic happens on port ' + port);
exports = module.exports = app;
