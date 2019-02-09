"use strict";

let express = require('express');
let app = express();
let path = require('path');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, 'client/min')));

app.all('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
});

app.all('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'room.html'));
});
io.on('connection', function(socket) {
    socket.on('delete', (msg, fn) => {
        console.log('client asked to delete: ' + msg);
        fn('Success');
        // fn('Okay, i\'ll delete room named ' + msg);
    });
    console.log('New connection');
});

http.listen(port, function(){
    console.log('listening on port: ' + port);
});