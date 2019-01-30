let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('message', function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});