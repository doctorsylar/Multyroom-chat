import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io();

function RoomAdder (props) {
    return (
        <form className="room-adder" onSubmit={props.submitting}>
            <input type="text" id="plus-name"
                   placeholder="New room name..."/>
            <input type="submit" id="plus-room" title="New chatroom name" value="+" />
        </form>
    )
}

function Room (props) {
    return (
        <CSSTransition in={props.show}
                       classNames="room"
                       timeout={800}
                       unmountOnExit
        >
            {status => (
                <li className='room'>
                    <a href={props.roomname}>{props.roomname}</a>
                    <button title='delete room'
                            onClick={props.deleteRoom}
                            data-roomname={props.roomname}
                    >-</button>
                </li>
            )}
        </CSSTransition>
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
                <Room show={true}
                      roomname={room}
                      deleteRoom={this.props.deleteRoom}
                />
            )
        });
        console.log(list);
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
    componentDidMount() {
        socket.emit('roomsAppInitialized', '', (data) => {
            this.setState({
                rooms: data
            });
        });
        socket.on('roomsListChanged', (roomsList) => {
            console.log('got broadcasted event');
            this.setState({
                rooms: roomsList
            });
        });
    }
    addNewRoom = (event) => {
        event.preventDefault();
        let inpField = event.target.children[0];
        let inputValue = inpField.value.trim().replace(/ /g, '_');
        if (inputValue !== '' &&
            inputValue.length <= 50 &&
            this.state.rooms.indexOf(inputValue) === -1) {
            event.target.children[0].value = '';
            socket.emit('addNewRoom', inputValue,
                (data) => {
                    if (data === 'Success') {
                        let roomsArray = this.state.rooms;
                        roomsArray.push(inputValue);
                        this.setState({
                            rooms: roomsArray
                        });
                    }
                });
        }
    };
    deleteRoom = (event) => {
        console.log(event.target.getAttribute('data-roomname'));
        let roomname = event.target.getAttribute('data-roomname');
        socket.emit('deleteRoom', roomname,
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
                <RoomAdder submitting={this.addNewRoom} />
                <RoomsList rooms={this.state.rooms}
                           deleteRoom={this.deleteRoom}
                />
            </div>
        )
    }
}
export default RoomsApp;