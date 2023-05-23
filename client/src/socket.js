import io from 'socket.io-client';

export const socket = io('http://localhost:8080', {
  transports : ['websocket', 'polling']
});


// export const socket = io('http://quickest-wind-production.up.railway.app', {
//   transports : ['websocket', 'polling']
// });