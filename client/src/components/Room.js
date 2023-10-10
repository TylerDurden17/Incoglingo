import React, {useEffect, useState} from "react";
import './Room.css';
import { useParams } from 'react-router-dom';
import MessageContainer from "./messageContainer";
import VideoGrid from "./videoGrid";
import Peer from 'peerjs'
import io from 'socket.io-client';

function Room() {
    
  const { roomId } = useParams();

  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {

    const newPeer = new Peer(undefined, {
      host: "0.peerjs.com",
      port: 443,
      path: "/"
    });

    setPeer(newPeer)

    //for development on local machine
    // const socket = io('http://localhost:8080', {
    //   transports : ['websocket', 'polling']
    // });
    // for production
    const socket = io('https://incoglingo.onrender.com/', {
      transports : ['websocket', 'polling']
    });

    setSocket(socket);
    
    /*By using setTimeout with a delay of 0, 
      you're essentially scheduling the execution of the code inside the callback function to
      occur in the next event cycle,
      allowing any pending rendering to complete first.
     */
    setTimeout(() => {
      const name = window.prompt('Please enter your name:');
      setName(name);
    }, 0);

    // Disconnect socket when component is unmounted (i.e., on navigation)
    return () => {
      socket.disconnect();
      if(peer){
      peer.disconnect();
      peer.destroy();}
    };

  }, []);

useEffect(() => {
  if(peer) {
    peer.on("open", (id) => {
        socket.emit('join-room', roomId, id, name);
    });    
  }

}, [roomId, name]);

  return (
    <>
      <header>
        <h4 id="groupName">Incoglingo</h4>
      </header>

      <article id="bothchats">

        <div id="inner-audio-chat">
          
        {peer && (<VideoGrid name={name} newPeer = {peer} socket={socket}/>)}

        </div>

        <div id="texting">
          <div id="texting-child">
            {/* display the list of connected users*/}

            {socket && <MessageContainer socket={socket}/>}
          
          </div>

        </div>
        
      </article>


    </>
  );
}

export default Room;