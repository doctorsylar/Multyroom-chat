'use strict';
import './css/index.css';
import './css/index-transitions.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomsList from './components/rooms-list';
import './js/commons';

// JS CODE
let username = window.sessionStorage.getItem('username') || 'Guest';
// Rendering RoomList component
ReactDOM.render(<RoomsList rooms={[]} username={username} />, document.querySelector('#rooms-container'));