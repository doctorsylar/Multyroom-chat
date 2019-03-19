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
        // vars
        this.users = 0;
        this.userSockets = {};
        this.leavingUsers = [];

        // creating inner io instance for custom socket
        this.io = io.of(arg);
        this.io.on('connection', (socket) => {
            // event listeners
            socket.on('msgSent', (msg, fn) => {
                fn('Success');
                socket.broadcast.emit('newMessage', msg);
            });
            socket.on('userEntered', (username, fn) => {
                this.io.clients((error, clients) => {
                    if (error) throw error;
                    if (this.leavingUsers.indexOf(username) === -1) {
                        // console.log('user connected: ' + username);
                        socket.broadcast.emit('newUser', username);
                    }
                    else {
                        // console.log('user REconnected: ' + username);
                    }
                    this.users = clients.length;
                    this.userSockets[socket.id] = username;
                    fn(this.users);
                    socket.broadcast.emit('userCountChanged', this.users);
                    // console.log(this.userSockets);
                    // console.log(this.leavingUsers);
                });
            });
            // on disconnect
            socket.on('disconnect', (info) => {
                this.users--;
                // console.log(this.users);
                this.io.emit('userCountChanged', this.users);
                let disconnectedUsername = this.userSockets[socket.id];
                // console.log('user disconnected:' + disconnectedUsername);
                this.leavingUsers.push(disconnectedUsername);
                delete this.userSockets[socket.id];
                setTimeout(() => {
                    while (this.leavingUsers.indexOf(disconnectedUsername) !== -1) {
                        this.leavingUsers.splice(this.leavingUsers.indexOf(disconnectedUsername), 1);
                    }
                }, 500);
            })
            // actions after connection
        });
    };
    countUsers () {
        return this.users.length;
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
// listeners for events on the index page
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
            delete roomObjectsList[roomname];
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
// creating socket objects for rooms which exists at app's start
for (let room of roomsList) {
    roomObjectsList[room] = createCustomSocket('/' + room)
}
// functions
function createCustomSocket(namespace) {
    return new CustomSocket(namespace);
}