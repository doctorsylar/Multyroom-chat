import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io();
function HeaderInfo (props) {
    return (
        <div className="header-info__container">
            <div className="header-info__text">Roomname:</div>
            <div className="header-info__text"><b>{ props.roomname }</b></div>
            <div className="header-info__text">Username:</div>
            <div className="header-info__text"><b>{ props.username }</b></div>
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
                <div className="header-logo__container">
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
            <div className="chat_window">
                <ChatHeader username={this.props.username}

                />
                <div className="chat_messages">

                </div>
                <div className="chat_input">

                </div>
            </div>
        )
    }
}
export default ChatRoomApp;