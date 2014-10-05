// server.js

// modules -----------
var express = require('express');
var app = express();

// var port = process.env.PORT || 8888;
var port = 8888;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
  res.sendFile('./public/index.html');
});

var fudz = {};
var keys = {
    right: 0,
    left: 1,
    up: 2,
    down: 3
};

var count = {u: 0, d: 0, l: 0, r: 0};

sio.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
        socket.join(data.room);
        socket.set('room', data.room);
        socket.emit('position', fudz[data.room][pos]);
    });

    socket.on('move', function(key) {
        if (key == up) {
            count.u += 1;
        } else if (key == down) {
            count.d += 1;
        } else if (key == right) {
            count.r += 1;
        } else if (key == left) {
            count.l += 1;
        }
        var max = 0;
        var node = '';

        for (count.has(dir)) {
            var temp = max;
            max = Math.max(count[dir], max);
            if (temp != max) {
                node = dir;
            }
        }
        socket.emit('move', node);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected');
        socket.get('room', function(err, room) {
            sio.sockets.in(room).emit('leave');
            if (fudz.has(room)) {
                fudz.delete(room);
            }
        });
    });
});

console.log('Magic happens on port ' + port);
exports = module.exports = app;
