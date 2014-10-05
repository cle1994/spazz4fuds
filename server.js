// server.js

// modules -----------
var path = require('path');
var express = require('express');
var app = express();

// var port = process.env.PORT || 8888;
var port = 8888;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

var fudz = {};

var count = {u: 0, d: 0, l: 0, r: 0};

sio.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
        socket.join(data.room);
        if (data.room in fudz) {
            sio.sockets.in(data.room).emit('join data', fudz[data.room]);
        } else {
            fudz[data.room] = count;
        }
    })
    socket.on('move', function(data) {
        fudz[data.room][data.move[0]] += 1;
        sio.sockets.in(data.room).emit('move', data);
    })
});

console.log('Magic happens on port ' + port);
exports = module.exports = app;
