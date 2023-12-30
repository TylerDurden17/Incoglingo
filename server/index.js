const express = require('express');
require('dotenv').config()
const app = express();
//create a server to use with socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server
  // , {
  // connectionStateRecovery: {
  //   // the backup duration of the sessions and the packets
  //   maxDisconnectionDuration: 2 * 60 * 1000,
  //   // whether to skip middlewares upon successful recovery
  //   skipMiddlewares: true,
  // }
  // }
)

const port = process.env.PORT || 8080;

io.on('connection', (socket) => {
    // if (socket.recovered) {
    //   // recovery was successful: socket.id, socket.rooms and socket.data were restored
    //   console.log('Recovery successful');
    // } else {
    //   // new or unrecoverable session
    //   console.log('New or unrecoverable session');
    //   // socket.join(roomId);
    //   // socket.broadcast.to(roomId).emit('user-connected', peerId, name);
    // }
    socket.on('join-room', (roomId, peerId, name) => {
        //console.log(`peerId: `+ peerId);
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
        //deliberate because there can be disconnections by a ghost and can't close call on those
        socket.on('deliberate-disconnect', () => {
          socket.broadcast.to(roomId).emit('deliberate', peerId);
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