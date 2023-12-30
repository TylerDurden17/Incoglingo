import React, { useEffect, useState } from "react";
import "./Room.css";
import { useParams } from "react-router-dom";
import MessageContainer from "./messageContainer";
import VideoGrid from "./videoGrid";
import Peer from "peerjs";
import io from "socket.io-client";
import Spinner from 'react-bootstrap/Spinner';
import Modal from "react-modal";

function Room() {
  const { roomId } = useParams();
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Only initialize peer and socket after the user has provided their name
  useEffect(() => {
    
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then(() => {
            localStorage.setItem('microphonePermission', true);
            setModalIsOpen(false);
        })
        .catch(error => {
            console.error('Error answering call.', error);
            setModalIsOpen(true);
            localStorage.setItem('microphonePermission', false);
        });

    if(localStorage.getItem('microphonePermission') === null) {
      setModalIsOpen(true);
    }
  
    if(localStorage.getItem('microphonePermission') === 'false'){
      setModalIsOpen(true);
    }


    if (!name) return;

    const newPeer = new Peer(undefined, {
      host: "0.peerjs.com",
      port: 443,
      path: "/"
    });

    // const newSocket = io("http://localhost:8080", {
    //   transports : ["websocket", "polling"]
    //   // reconnectionDelay: 10000, // defaults to 1000
    //   // reconnectionDelayMax: 10000 // defaults to 5000
    // });
    const newSocket = io('https://incoglingo.onrender.com/', {
      transports : ['websocket', 'polling'],
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
      reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
    });

    // newSocket.on('reconnect', (attemptNumber) => {
    //   console.log(`Reconnected to server after ${attemptNumber} attempts`);
    // });

    newPeer.on("open", (id) => {
      newSocket.emit("join-room", roomId, id, name);
      setIsRoomJoined(true); // Room is now joined
    });


    setPeer(newPeer);
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newPeer.destroy();
      newPeer.disconnect();
      newSocket.disconnect();
    };
  }, [name, roomId]);

  const handleNameSubmit = (event) => {
    event.preventDefault(); 
    
      const formData = new FormData(event.target);
      const enteredName = formData.get("name");
      setName(enteredName); // This will kick-off the peer and socket initialization
    
  };

  // The user will first provide their name before the rest of the UI loads
  if (!isRoomJoined && !modalIsOpen) {
    return (
      <div className="name-prompt">
        <form onSubmit={handleNameSubmit}>
          <label htmlFor="name">Please enter your name:</label>
          <input id="name" name="name" type="text" required autoFocus />
          <button type="submit" disabled={name}> 
            { name ?
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
            :'Join Room'}
          </button>
          
        </form>
      </div>
    );
  }

  if(modalIsOpen){
    return(
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Microphone Access Modal"
          ariaHideApp={false}
          shouldCloseOnOverlayClick={false} // Prevent closing on click outside
          shouldCloseOnEsc={false} // Prevent closing on escape key
          >
          <div className='modalContent'>
              <div>
                  <h1>Microphone Access Required</h1>
                  <img src='https://i.imgur.com/GncKY89.png' alt="from address bar allow microphone"
                  style={{ width: '200px'}}></img>
                  <p>You can turn off your microphone any time you want.</p>
              </div>
          </div>
      </Modal> 
      );
  }

  // const disconnectSocket = () => {
  //   console.log('clicked');
  //   socket.io.engine.close();
  // };

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