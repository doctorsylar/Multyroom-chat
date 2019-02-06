import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';

class RoomList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: props.rooms
        }
    }
    render() {
        let list = [];
        this.state.rooms.forEach((room) => {
            room = room.trim().replace(/ /g, '_');
            list.push(
                <li className='roomslist-item'>
                    <a href={room}>{room}</a>
                    <button title='delete room'>-</button>
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

export default RoomList;