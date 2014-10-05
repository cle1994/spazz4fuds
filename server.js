// server.js

// modules -----------
var path = require('path');
var express = require('express');
var app = express();
var ordrin = require("ordrin-api");
var ordrin_api = new ordrin.APIs('Igb2NGzGm6tjaTfLiFaemFfVe7Yy1hhgHCOlV-DBuLk', ordrin.TEST);

// var port = process.env.PORT || 8888;
var port = 8888;
var sio = require('socket.io').listen(app.listen(port));

// config ------------
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

var fudz = {};

var count = {u: 0, d: 0, l: 0, r: 0, rest1: 'hello', rest2: 'hello', rest3: 'hello', rest4: 'hello'};

function setRest(address, sock, room) {
    var args = {
        datetime: 'ASAP',
        addr: address.street,
        city: address.city,
        zip: address.zip
    };
    ordrin_api.delivery_list(args, function(error, data) {
        console.log(data);
        var select = [];
        for (var i = 0; i < 4; i += 1) {
            select.push(data[Math.floor(Math.random() * 62)]);
        }
        fudz[room]['rest1'] = select[0];
        fudz[room]['rest2'] = select[1];
        fudz[room]['rest3'] = select[2];
        fudz[room]['rest4'] = select[3];
        sock.in(room).emit('join data', fudz[room]);
    })
};

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
        sio.sockets.in(data.room).emit('move', fudz[data.room]);
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
