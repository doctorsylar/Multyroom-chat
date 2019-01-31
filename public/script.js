'use strict';
window.onload = function () {
    document.querySelector('#msg-form').addEventListener('submit', formSubmitHandler);
    function formSubmitHandler(event) {
        let msg = document.querySelector('#msg');
        event.preventDefault();
        if (msg.value.trim() !== '') {
            socket.emit('message', msg.value.trim());
            msg.focus();
        }
        msg.value = '';
    }
    let socket = io();
    socket.on('message', printMsg);
    function printMsg (msg) {
        let messages = document.querySelector('#messages');
        messages.innerHTML = messages.innerHTML + '<li>' + msg + '</li>';
    }
};