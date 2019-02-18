"use strict";
// imports
let express = require('express');
let app = express();
let path = require('path');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
// variables
let roomsList = ['Main_room_1', 'Main_room_2', 'Main_room_3', 'Main_room_4'];

// Path to static files (css, js)
app.use(express.static(path.join(__dirname, 'client/static')));
// Routing
app.all('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
});
app.all('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'room.html'));
});
io.on('connection', function(socket) {
    socket.on('addNewRoom', (roomname, fnc) => {
        console.log('client asked to add: ' + roomname);
        roomname = roomname.trim().replace(/ /g, '_');
        if (roomsList.indexOf(roomname) === -1) {
            roomsList.push(roomname);
            fnc('Success');
            console.log(roomsList);
            socket.broadcast.emit('roomsListChanged', roomsList);
        }
    });
    socket.on('deleteRoom', (roomname, fn) => {
        console.log('client asked to delete: ' + roomname);
        let deletedIndex = roomsList.indexOf(roomname);
        if (deletedIndex !== -1) {
            roomsList.splice(deletedIndex, 1);
            fn('Success');
            console.log(roomsList);
            socket.broadcast.emit('roomsListChanged', roomsList);
        }
    });
    socket.on('roomsAppInitialized', (msg, fn) => {
        console.log('React rooms app initialized');
        fn(roomsList);
    });
    socket.on('msgSent', (msg, fn) => {
        console.log(msg);
        // fn('Success');
        socket.broadcast.emit('newMessage', msg);
    });
    socket.on('disconnect', (reason) => {
        console.log(reason)
    });
    console.log('New connection');
    // console.log(socket);
});
let test = io.of('/Main_room_3');
test.on('connection', function (socket) {
    console.log('Test connetction')
});
http.listen(port, function(){
    console.log('listening on port: ' + port);
});