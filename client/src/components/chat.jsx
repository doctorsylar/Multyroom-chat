import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io();
class ChatHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <header className="chat_header">

            </header>
        )
    }
}
class ChatRoomApp extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <ChatHeader/>
            </div>
        )
    }
}
export default ChatRoomApp;