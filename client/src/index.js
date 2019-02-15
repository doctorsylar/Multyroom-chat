'use strict';
import './css/index.css';
import './css/index-transitions.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomsList from './components/rooms-list';
import './js/commons';

// JS CODE

// Rendering RoomList component
ReactDOM.render(<RoomsList rooms={[]} />, document.querySelector('#rooms-container'));