let express = require('express');
let app = express();
let path = require('path');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
    socket.on('message', function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

http.listen(port, function(){
    console.log('listening on *:3000');
});