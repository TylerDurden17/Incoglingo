import Peer from 'peerjs'

const newPeer = new Peer(undefined, {
  host: "0.peerjs.com",
  port: 443,
  path: "/"
});

export default newPeer;