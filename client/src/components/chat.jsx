import React, {Component} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';

const socket = io(window.location.pathname);
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
        return (
            <TransitionGroup className="chat_messages"
                             component="div"
            >
                {
                    this.props.messages.map((message) => (
                        <CSSTransition in={ message.show }
                                       classNames="chat_message"
                                       timeout={800}
                                       mountOnEnter={ true }
                        >
                            { status => (
                                <Message
                                    date={ message['date'] }
                                    author={ message['author'] }
                                    text={ message['text'] }
                                />
                            )}
                        </CSSTransition>
                    ))
                }
            </TransitionGroup>
        )
    }
}
class ChatInput extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        document.querySelector('#msg_input').onkeydown = function (event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                document.querySelector('.send_btn').click();
            }
        }
    }
    render() {
        return (
            <form className="chat_input" action="" onSubmit={ this.props.sendMessage }>
                <textarea name="msg" id="msg_input" rows="3"></textarea>
                <div className="chat_input_submit__container">
                    <input className="send_btn" type="submit" value="SEND"/>
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
            let messages = this.state.messages;
            messages.push(msg);
            this.setState({
                messages: messages
            });
        });
    }
    sendMessage = (event) => {
        event.preventDefault();
        let inputField = event.target.children[0];
        if (inputField.value.trim() !== '') {
            let time = new Date();
            let msg = {
                date: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
                author: window.sessionStorage.getItem('username'),
                text: inputField.value
            };
            socket.emit('msgSent', msg, (data) => {
                if (data === 'Success') {
                    let messages = this.state.messages;
                    messages.push(msg);
                    this.setState({
                        messages: messages
                    });
                }
            });
        }
        inputField.value = '';
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