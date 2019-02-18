import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io(window.location.pathname);
console.log(window.location.pathname);
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
                <HeaderInfo username={ this.props.username }
                            roomname={ this.props.roomname }
                />
            </header>
        )
    }
}
function Message(props) {
    return(
        <div className="chat_message">
            <div className="chat_message__date">
                { props.date }
            </div>
            <div className="chat_message__author">
                { props.author === 'system' ? '' : props.author + ':' }
            </div>
            <div className={ props.author === 'system' ?
                'chat_message__text chat_message__text--system' : 'chat_message__text' }>
                { props.text }
            </div>
        </div>
    )
}
class ChatMessages extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let messagesList = [];
        this.props.messages.map((message) => (
            messagesList.push(
            <Message
                date={ message['date'] }
                author={ message['author'] }
                text={ message['text'] }
            />
            )
        ));
        return (
            <div className="chat_messages">
                { messagesList }
            </div>
        )
    }
}
class ChatInput extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <form className="chat_input" action="" onSubmit={ this.props.sendMessage }>
                <textarea name="msg" id="msg_input" rows="5"></textarea>
                <div className="chat_input_submit__container">
                    <input type="submit" value="SEND"/>
                </div>
            </form>
        )
    }
}
class ChatRoomApp extends Component {
    constructor(props) {
        super(props);
        let time = new Date();
        this.state = {
            messages: [{
                date: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
                author: 'system',
                text: 'User ' + props.username + ' joined room ' + props.roomname
            }],
            username: props.username
        }
    }
    componentDidMount() {
        socket.on('newMessage', (msg) => {
            console.log('got broadcasted event');
            let messages = this.state.messages;
            messages.push(msg);
            this.setState({
                messages: messages
            });
        });
    }
    sendMessage = (event) => {
        event.preventDefault();
        let time = new Date();
        let msg = {
            date: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
            author: window.sessionStorage.getItem('username'),
            text: event.target.children[0].value
        };
        socket.emit('msgSent', msg);
    };
    render() {
        return (
            <div className="chat_window">
                <ChatHeader username={ this.state.username }
                            roomname={ this.props.roomname }

                />
                <ChatMessages
                    messages={ this.state.messages }
                />
                <ChatInput
                    sendMessage={ this.sendMessage }
                />
            </div>
        )
    }
}
export default ChatRoomApp;