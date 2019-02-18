'use strict';
import './css/room.css';
import './css/room-transitions.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomApp from './components/chat';
import './js/commons';


// JS CODE

let username = window.sessionStorage.getItem('username') || 'Guest';
let roomname = window.location.pathname.substr(1);
// Rendering chat component
ReactDOM.render(<RoomApp username={username} roomname={roomname} />, document.querySelector('#chat-room-app'));