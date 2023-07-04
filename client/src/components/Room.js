import React, {useEffect, useState} from "react";
import './Room.css';
import { useParams } from 'react-router-dom';
import {socket} from '../socket'
import MessageContainer from "./messageContainer";
import newPeer from "../peerobj";
import VideoGrid from "./videoGrid";
function Room() {
  
  const { roomId } = useParams();
  const name = window.prompt('What is your name?')

  useEffect(() => {
    const handleDisconnect = () => {
      console.log('Peer disconnected from server but reconnecting');
      // Handle the disconnection here, for example:
      // - Prompt the user to reconnect to the server
      // - Attempt to reconnect to the server automatically
      // - Clean up any resources associated with the peer
      newPeer.reconnect();
    };

    newPeer.on("open", (id) => {
      socket.emit('join-room', roomId, id, name);
      console.log('room joined');
    });

    newPeer.on('disconnected', handleDisconnect);

    return () => {
      newPeer.off('disconnected', handleDisconnect);
    };
  }, [roomId]);

  return (
    <>
      <header>
        <h4 id="groupName">Incoglingo</h4>
      </header>

      <article id="bothchats">

        <div id="inner-audio-chat">
            <VideoGrid name={name} />
        </div>

        <div id="texting">
          <div id="texting-child">
            {/* display the list of connected users*/}
            <MessageContainer/>
          </div>

        </div>
        
      </article>
    </>
  );
}

export default Room;