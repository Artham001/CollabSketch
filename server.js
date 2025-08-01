const express=require("express");
const http=require("http");
const socketIO=require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log('A user has connected!');

    socket.on('drawing' , data=>{
        socket.broadcast.emit('drawing',data)
    });
    socket.on('disconnect', () => {
        console.log('User has disconnected.');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    // Add this inside io.on('connection', ...) in server.js
    socket.on('clear canvas', () => {
        socket.broadcast.emit('clear canvas');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

