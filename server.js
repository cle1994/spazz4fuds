// server.js

// modules -----------
var path = require('path');
var express = require('express');
var app = express();
var ordrin = require("ordrin-api");
var ordrin_api = new ordrin.APIs('Igb2NGzGm6tjaTfLiFaemFfVe7Yy1hhgHCOlV-DBuLk', ordrin.TEST);

var port = process.env.PORT || 8888;
// var port = 8888;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

var fudz = {};

function setRest(address, sock, room) {
    var args = {
        datetime: 'ASAP',
        addr: address.street,
        city: address.city,
        zip: address.zip
    };
    ordrin_api.delivery_list(args, function(error, data) {
        var select = [];
        for (var i = 0; i < 4; i += 1) {
            select.push(data[Math.floor(Math.random() * 62)]);
        }
        sock.in(room).emit('restaurant', select);
    })
};

sio.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
        socket.join(data.room);
        if (data.room in fudz) {
            console.log('joining');
            socket.to(data.room).emit('joining', data);
        } else {
            console.log('new');
            fudz[data.room] = 1;
            sio.sockets.in(data.room).emit('new', fudz[data.room]);
        }
    })

    socket.on('data', function(data) {
        sio.sockets.in(data.room).emit('receive', data.data);
    })

    socket.on('updateRest', function(data) {
        sio.sockets.in(data.room).emit('receiveRest', data.restaurants);
    })

    socket.on('updateAddr', function(data) {
        sio.sockets.in(data.room).emit('receiveAddr', data.addr);
    })

    socket.on('move', function(data) {
        sio.sockets.in(data.room).emit('move', data);
    })

    socket.on('address', function(data) {
        setRest(data.addr, sio.sockets, data.room);
    })

    socket.on('destroy', function(data) {
        delete fudz[data.room];
    })
});

console.log('Magic happens on port ' + port);
exports = module.exports = app;
