import React, { useEffect, useState } from "react";
import "./Room.css";
import { useParams } from "react-router-dom";
import MessageContainer from "./messageContainer";
import VideoGrid from "./videoGrid";
import Peer from "peerjs";
import io from "socket.io-client";
import Spinner from 'react-bootstrap/Spinner';

function Room() {
  const { roomId } = useParams();
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  // Only initialize peer and socket after the user has provided their name
  useEffect(() => {
    if (!name) return;

    const newPeer = new Peer(undefined, {
      host: "0.peerjs.com",
      port: 443,
      path: "/"
    });

    // const newSocket = io("http://localhost:8080", {
    //   transports : ["websocket", "polling"]
    // });
    const newSocket = io('https://incoglingo.onrender.com/', {
      transports : ['websocket', 'polling']
    });

    newPeer.on("open", (id) => {
      newSocket.emit("join-room", roomId, id, name);
      setIsRoomJoined(true); // Room is now joined
    });

    setPeer(newPeer);
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
      newPeer.disconnect();
      newPeer.destroy();
    };
  }, [name, roomId]);

  const handleNameSubmit = (event) => {
    event.preventDefault();
    
      const formData = new FormData(event.target);
      const enteredName = formData.get("name");
      setName(enteredName); // This will kick-off the peer and socket initialization
    
  };

  // The user will first provide their name before the rest of the UI loads
  if (!isRoomJoined) {
    return (
      <div className="name-prompt">
        <form onSubmit={handleNameSubmit}>
          <label htmlFor="name">Please enter your name:</label>
          <input id="name" name="name" type="text" required autoFocus />
          <button type="submit" disabled={name}> { name ?
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
          :'Join Room'}</button>
          
        </form>
      </div>
    );
  }

  // Render the main UI only after the room has been joined
  return (
    <>
      <header>
        <h4 id="groupName">Incoglingo</h4>
      </header>
      <article id="bothchats">
        <div id="inner-audio-chat">
          {peer && socket && (<VideoGrid name={name} newPeer={peer} socket={socket} />)}
        </div>
        <div id="texting">
          <div id="texting-child">
            {socket && <MessageContainer socket={socket} />}
          </div>
        </div>
      </article>
    </>
  );
}

export default Room;