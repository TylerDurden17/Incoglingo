import Peer from 'peerjs'

const newPeer = new Peer(undefined, {
  host: "localhost",
  port: 9000,
  path: "/myapp"
});

export default newPeer;