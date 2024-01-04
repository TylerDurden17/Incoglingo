const express = require('express');
require('dotenv').config()
const app = express();
//create a server to use with socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    }
  }
)

const port = process.env.PORT || 8080;

// Declare global variables to store the parameters so after recovery I still have
// roomId, id since i don't want to join room again

let roomId = null;

io.on('connection', (socket) => {

    let naam = null;
    let peerId = null;

    socket.on('join-room', (receivedRoomId, receivedPeerId, receivedName) => {
      console.log(receivedPeerId);
        roomId = receivedRoomId;
        peerId = receivedPeerId;
        naam = receivedName;

        socket.join(receivedRoomId);
        // you have to emit something to the socket first so recovery is succesfull
        // at unexpected disconnection
        socket.emit('joined')
        socket.broadcast.to(receivedRoomId).emit('user-connected', receivedPeerId, receivedName);

    });

        
    if (socket.recovered) {
      console.log('Recovery successful');

      socket.on('name', (name, id) => {
        naam = name;
        peerId = id;
        socket.broadcast.to(roomId).emit('user-recovered', naam);
      });
    } else {
      console.log('New or unrecoverable session');
    }

    socket.on('send-chat-message', message => {
      socket.broadcast.to(roomId).emit('chat-message', {message:message, name: naam}); 
    });
    
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', peerId, naam);
    });

    //deliberate because there can be disconnections by a ghost and can't close call on those
    socket.on('deliberate-disconnect', (id) => {
      socket.broadcast.to(roomId).emit('deliberate', id);
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