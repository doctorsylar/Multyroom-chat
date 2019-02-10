import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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

class Room extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            name: props.roomname
        }
    }
    deleteRoom = (event) => {
        this.setState({
            show: false
        });
        this.props.deleteRoom(event);
    };
    render() {
        return (
            <li className='room'>
                <a href={this.state.name}>{this.state.name}</a>
                <button title='delete room'
                        onClick={this.deleteRoom}
                        data-roomname={this.state.name}
                >-</button>
            </li>
        )
    }
}

class RoomsList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomList: props.rooms
        }
    }
    render() {
        let list = this.state.roomList;
        return (
            <TransitionGroup className="rooms-list"
                             component="ul"
            >
                {
                    this.props.rooms.map((room) => (
                        <CSSTransition in={this.state.show}
                                       classNames="room"
                                       timeout={800}
                                       unmountOnExit
                        >
                            {status => (
                                <Room key={room}
                                  show={true}
                                  roomname={room}
                                  deleteRoom={this.props.deleteRoom}
                                />
                            )}
                        </CSSTransition>
                    ))
                }
            </TransitionGroup>
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