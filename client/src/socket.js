import io from 'socket.io-client';

// export const socket = io('http://localhost:8080', {
//   transports : ['websocket', 'polling']
// });


export const socket = io('https://incoglingo.onrender.com/', {
  transports : ['websocket', 'polling']
});