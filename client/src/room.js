'use strict';
import './css/room.css';
import './css/room-transitions.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomApp from './components/chat';
import './js/commons';
import io from "socket.io-client";


// JS CODE

const socket = io(window.location.pathname);

let username = window.sessionStorage.getItem('username') || 'Guest';
let roomname = window.location.pathname.substr(1);
// Rendering chat component
if (username !== 'Guest') {
    ReactDOM.render(<RoomApp
        socket={socket}
        username={username}
        roomname={roomname} />, document.querySelector('#chat-room-app'));
}
else {
    ReactDOM.render(<RoomApp
        username={username}
        roomname={roomname} />, document.querySelector('#chat-room-app'));
}