'use strict';
import './css/room.css';
import './css/room-transitions.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomApp from './components/chat';
import './js/commons';


// JS CODE
// variables

// Rendering chat component
ReactDOM.render(<RoomApp rooms={[]} />, document.querySelector('#rooms-container'));