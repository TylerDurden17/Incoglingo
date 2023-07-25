import io from 'socket.io-client';
//for development on local mac hine
// export const socket = io('http://localhost:8080', {
//   transports : ['websocket', 'polling']
// });

// for production
export const socket = io('https://incoglingo.onrender.com/', {
  transports : ['websocket', 'polling']
});