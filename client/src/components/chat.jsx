import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io();
function HeaderInfo (props) {
    return (
        <div className="header-info--container">
            <div className="header-info--text">Roomname:</div>
            <div className="header-info--text"><b>{ props.roomname }</b></div>
            <div className="header-info--text">Username:</div>
            <div className="header-info--text"><b>{ props.username }</b></div>
        </div>
    )
}
class ChatHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <header className="chat_header">
                <div className="header-logo--container">
                    <a href={window.location.href.substring(0, window.location.href.lastIndexOf('\/'))}>
                        <img src="./img/logo.svg" alt="AI - development"/>
                    </a>
                </div>
                <HeaderInfo username={this.props.username}
                            roomname={window.location.pathname.substr(1)}
                />
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
                <ChatHeader username={this.props.username}

                />
            </div>
        )
    }
}
export default ChatRoomApp;