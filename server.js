// server.js

// modules -----------
var express = require('express');
var app = express();

// var port = process.env.PORT || 8888;
var port = 8888;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

function generateRoom() {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var room = '';

  for (var i = 0; i < 8; i += 1) {
    room += chars.charAt(Math.floor(Math.random() * 62));
  }

  return room;
}

// routes ------------
require('./app/routes')(app);

console.log('Magic happens on port ' + port);
exports = module.exports = app;
