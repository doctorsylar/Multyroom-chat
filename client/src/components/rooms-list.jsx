import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io();

window.onload = function () {

};

function RoomAdder (props) {
    return (
        <form className="room-adder" onSubmit={props.submitting}>
            <input type="text" id="plus-name"
                   placeholder="New room name..."/>
            <input type="submit" id="plus-room" title="New chatroom name" value="+" />
        </form>
    )
}

class RoomsList extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        let list = [];
        this.props.rooms.forEach((room) => {
            room = room.trim().replace(/ /g, '_');
            list.push(
                <li className='roomslist-item'>
                    <a href={room}>{room}</a>
                    <button title='delete room'
                            onClick={this.props.deleteRoom}
                            data-roomname={room}
                    >-</button>
                </li>
            )
        });
        return (
            <ul className="rooms-list">
                { list }
            </ul>
        )
    }
}
class RoomsApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: props.rooms
        };
    }
    addNewRoom = (event) => {
        event.preventDefault();
        let inpField = event.target.children[0];
        if (inpField.value.trim() !== '') {
            let roomsArray = this.state.rooms;
            roomsArray.push(inpField.value);
            this.setState({
                rooms: roomsArray
            });
            event.target.children[0].value = '';
        }
    };
    deleteRoom = (event) => {
        console.log(event.target.getAttribute('data-roomname'));
        let roomname = event.target.getAttribute('data-roomname');
        socket.emit('delete', roomname,
            (data) => {
                if (data === 'Success') {
                    let roomsArray = this.state.rooms;
                    let deletedIndex = roomsArray.indexOf(roomname);
                    roomsArray.splice(deletedIndex, 1);
                    this.setState({
                        rooms: roomsArray
                    });
                }
            });
    };
    render() {
        return(
            <div className="rooms-app">
                <RoomAdder submitting={this.addNewRoom}
                ></RoomAdder>
                <RoomsList rooms={this.state.rooms}
                           deleteRoom={this.deleteRoom}
                />
            </div>
        )
    }
}
export default RoomsApp;