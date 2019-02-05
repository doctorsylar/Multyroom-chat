"use strict";

let express = require('express');
let app = express();
let path = require('path');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, 'front/dist')));

app.get('/', function (req, res) {

    res.sendFile(path.resolve(__dirname, 'front/dist', 'index.html'));
});

app.get('/:id', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'front/dist', 'room.html'));
});
io.on('connection', function(socket) {
    // socket.on('message', function(msg){
    //     console.log('message: ' + msg);
    //     io.emit('message', msg);
    // });
    console.log('New connection');
});

app.listen(port, function(){
    console.log('listening on port: ' + port);
});