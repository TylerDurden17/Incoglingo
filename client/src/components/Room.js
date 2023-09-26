import React, {useEffect} from "react";
import './Room.css';
import { useParams } from 'react-router-dom';
import MessageContainer from "./messageContainer";
import VideoGrid from "./videoGrid";
import Peer from 'peerjs'
import io from 'socket.io-client';

function Room() {
    
  const { roomId } = useParams();

  const naam = window.prompt('Please enter your name:');

  const newPeer = new Peer(undefined, {
    host: "0.peerjs.com",
    port: 443,
    path: "/"
  });

  //====================================================================================

  //for development on local machine
  // const socket = io('http://localhost:8080', {
  //   transports : ['websocket', 'polling']
  // });
  // for production
  const socket = io('https://incoglingo.onrender.com/', {
    transports : ['websocket', 'polling']
  });

//=======================================================================================

  useEffect(() => {
    const handleDisconnect = () => {
      console.log('Peer disconnected from server but reconnecting');
      // Handle the disconnection here, for example:
      // - Prompt the user to reconnect to the server
      // - Attempt to reconnect to the server automatically
      // - Clean up any resources associated with the peer
      newPeer.destroy();
      newPeer.reconnect();
    };
    
    newPeer.on("open", (id) => {
        socket.emit('join-room', roomId, id, naam);
        //console.log('room joined with name:', naam);
    });
    
    newPeer.on('disconnected', handleDisconnect);

    return () => {
      newPeer.off('disconnected', handleDisconnect);
      newPeer.destroy();
    };
  }, [roomId, naam]);

  return (
    <>
      <header>
        <h4 id="groupName">Incoglingo</h4>
      </header>

      <article id="bothchats">

        <div id="inner-audio-chat">
          
            <VideoGrid naam={naam} newPeer={newPeer} socket={socket}/>


        </div>

        <div id="texting">
          <div id="texting-child">
            {/* display the list of connected users*/}

            <MessageContainer socket={socket}/>
          
          </div>

        </div>
        
      </article>


    </>
  );
}

export default Room;