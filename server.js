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
let roomObjectsList = {};

// class for custom socket objects
class CustomSocket {
    constructor(arg) {
        this.io = io.of(arg);
        this.io.on('connection', function (socket) {
            socket.on('msgSent', (msg, fn) => {
                fn('Success');
                socket.broadcast.emit('newMessage', msg);
            });
        })
    }
}

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
        roomname = roomname.trim().replace(/ /g, '_');
        if (roomsList.indexOf(roomname) === -1) {
            roomsList.push(roomname);
            roomObjectsList[roomname] = createCustomSocket('/' + roomname);
            fnc('Success');
            socket.broadcast.emit('roomsListChanged', roomsList);
        }
    });
    socket.on('deleteRoom', (roomname, fn) => {
        let deletedIndex = roomsList.indexOf(roomname);
        if (deletedIndex !== -1) {
            roomsList.splice(deletedIndex, 1);
            fn('Success');
            socket.broadcast.emit('roomsListChanged', roomsList);
        }
    });
    socket.on('roomsAppInitialized', (msg, fn) => {
        fn(roomsList);
    });
});
http.listen(port, function(){
    console.log('listening on port: ' + port);
});
for (let room of roomsList) {
    roomObjectsList[room] = createCustomSocket('/' + room)
}
// functions
function createCustomSocket(namespace) {
    return new CustomSocket(namespace);
}