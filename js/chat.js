let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let log4js = require('log4js');
let logger = log4js.getLogger();

let port = 3000;
logger.debug('Script has been started...');
server.listen(port);