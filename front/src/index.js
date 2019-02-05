'use strict';
import '../dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import '../../node_modules/socket.io-client/dist/socket.io';

// JS CODE
document.querySelector('#plus-room').onclick = createNewChatRoom;
function createNewChatRoom() {
    console.log(document.querySelector('#plus-name').value);
}
// socket.io
// let socket = io();


// Rendering RoomList component
// ReactDOM.render(document.getElementById('app'));