const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const corsOptions = {
    origin: ['*']
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', ({ message, username }) => {
        console.log('message: ' + message, '. from user: ', username);
        io.emit('newChatMessage', { message, username }); // This will emit the event to all connected sockets
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});

