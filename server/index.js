const express = require('express');
require('dotenv').config()
const app = express();
//create a server to use with socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server)

const port = process.env.PORT || 8080;

io.on('connection', (socket) => {
    //console.log(socket);
    console.log('connected');
    socket.on('join-room', (roomId, peerId, name) => {
        console.log(`peerId: `+ peerId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', peerId, name);

        socket.on('send-chat-message', (message) => {
          socket.broadcast.to(roomId).emit('chat-message',
          {message:message, name: name});
        });
        
        socket.on('disconnect', () => {
          socket.broadcast.to(roomId).emit('user-disconnected',
           peerId, name);
        });
    });

});

server.listen(port, () => {
    console.log(`running on port ${port}`);

    if (process.env.NODE_ENV === "production") {
        // application is running in production mode
        console.log('running in production mode');
      } else {
        // application is running in development mode
        console.log('running in development mode');
        
      }
});