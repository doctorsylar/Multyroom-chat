'use strict';
import '../dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomList from './components/rooms-list';
// import '../../node_modules/socket.io-client/dist/socket.io';

// JS CODE
// variables
let sessionStorage = window.sessionStorage;

// after loading page
window.onload = function () {
    checkUsername();
    // adding new room
    document.querySelector('#plus-room').onclick = createNewChatRoom;
    function createNewChatRoom() {
        console.log(document.querySelector('#plus-name').value);
    }
    document.querySelector('#username-form').onsubmit = submitUsername;
    document.querySelector('.room-adder').onsubmit = addNewChatroom;
};


// socket.io
// let socket = io();

let appRoomsList = ['abc', 'bab123', 'bao bab', 'k0s2-xss   '];

// Rendering RoomList component
ReactDOM.render(<RoomList rooms={appRoomsList}/>, document.querySelector('#rooms-container'));

// functions
function checkUsername() {
    if (sessionStorage.getItem('username') == null) {
        let nameContainer = document.querySelector('.name-container');
        nameContainer.style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';
    }
}
function submitUsername(event) {
    event.preventDefault();
    let usernameField = event.target.children[0];
    if (usernameField.value.trim() !== '') {
        sessionStorage.setItem('username', usernameField.value);
        document.querySelector('.name-container').style.display = 'none';
        document.querySelector('#overlay').style.display = 'none';
    }
    else {
        usernameField.value = '';
    }
}
function addNewChatroom(event) {
    event.preventDefault();

}