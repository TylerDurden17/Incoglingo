import React, { useEffect, useState } from "react";
import "./Room.css";
import { useParams } from "react-router-dom";
import MessageContainer from "./messageContainer";
import VideoGrid from "./videoGrid";
import Peer from "peerjs";
import io from "socket.io-client";
import Spinner from 'react-bootstrap/Spinner';
import Modal from "react-modal";
import IndividualSessionData from "./individualSessionData"

function  Room() {
  const {roomId} = useParams();
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [activeTab, setActiveTab] = useState('tabA');
  const [width, setWidth] = useState(window.innerWidth);
  const [newMessages, setNewMessages] = useState(false);
  const [sessionData, setSessionData] = useState({})

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }


  useEffect(() => { 

    let streams;//to store streams because useState is too slow when needed to unmount
        
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStorage.setItem('microphonePermission', true);
        setModalIsOpen(false);
        setMyStream(stream)
        streams = stream // Add the stream to the streams array
    })
    .catch(error => {
        console.error('Error answering call.', error);
        setModalIsOpen(true);
        localStorage.setItem('microphonePermission', false);
    });
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
      // Stop and clean up all media streams
      streams.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const isMobile = width <= 768;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (activeTab==='tabB' && tab === 'tabA' && newMessages) {
      setNewMessages(false);
    }
  };

  // Only initialize peer and socket after the user has provided their name
  useEffect(() => {

    if(localStorage.getItem('microphonePermission') === null) {
      setModalIsOpen(true);
    }
  
    if(localStorage.getItem('microphonePermission') === 'false'){
      setModalIsOpen(true);
    }


    if (!name) return;

    const newPeer = new Peer(undefined, {
      // host: "https://0.peerjs.com/",
      port: 443,
      path: "/"
    });

    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      transports : ["websocket", "polling"],
       reconnectionDelay: 1000, // defaults to 1000
       reconnectionDelayMax: 5000, // defaults to 5000
       reconnectionAttempts: 5
    });
    // const newSocket = io('https://incoglingo.onrender.com/', {
    //   transports : ['websocket', 'polling'],
    //   reconnection: true, // Enable reconnection
    //   reconnectionAttempts: 5, // Number of reconnection attempts
    //   reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
    //   reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
    // });

    newPeer.on("open", (id) => {
      newSocket.emit("join-room", roomId, id, name);
    });


    newSocket.on('joined', () => {
      setIsRoomJoined(true); // Room is now joined
    })

    newSocket.on('chat-message', () => {
      setNewMessages(true)
    });


    setPeer(newPeer);
    setSocket(newSocket);


    // Clean up on component unmount
    return () => {
        newSocket.disconnect();
        newPeer.destroy();
        newPeer.disconnect();
    };
  }, [name, roomId]);

  const handleNameSubmit = (event) => {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const enteredName = formData.get("name");
    setName(enteredName); // This will kick-off the peer and socket initialization
    
  };

  const updateMyStream = (newValue) => {
    setMyStream(newValue);
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

  if(isRoomJoined){

    socket.on("connect", () => {
      console.log("Connected!");
      
      if (socket.recovered) {
        // Socket was recovered 
        console.log('recovered');
        socket.emit('name', name, peer.id, roomId );
        //newSocket.emit("join-room", roomId, id, name)
        // Could not recover - rejoin manually
      } else {
        // New socket
        //recovery fails if the socket has not recieved any message
        console.log('Failed');
      }
    });
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
  const handleQuestionsfromChild = (data) => {
    // console.log(data);
    setSessionData(data);
  }
  return (
    <>
      <header>
        <h4 style={{fontFamily:'ubuntumono', fontWeight:"800", color:'#007BFF'}} id="groupName">Incoglingo</h4>
      </header>
      <div className="tabs">
      {isMobile ? (
        // Mobile Layout
        <div className="mobile-layout">
          <div className="tab-header">
            <button
              className={`tab-button ${activeTab === 'tabA' ? 'active' : ''}`}
              onClick={() => handleTabClick('tabA')}
            >
              Video
            </button>
            <button
              className={`tab-button ${activeTab === 'tabB' ? 'active' : ''}`}
              onClick={() => handleTabClick('tabB')}
            >
              Texting
              {activeTab !== 'tabB' && newMessages && <span><sup> 🔴</sup></span>}
            </button>
            {/* Add more tab buttons as needed */}
          </div>
          
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === 'tabA' ? 'active' : 'hidden'}`}>
              {peer && socket && (<VideoGrid updateMyStream={updateMyStream} myStream={myStream} name={name} newPeer={peer} socket={socket} sessionData={sessionData}/>)}
            </div>
            <div className={`tab-pane ${activeTab === 'tabB' ? 'active' : 'hidden'}`}>
              {socket && <MessageContainer socket={socket} roomId={roomId}/>}
              <IndividualSessionData roomId={roomId} handleQuestionsfromChild={handleQuestionsfromChild}/>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="desktop-layout">
          <article id="bothchats">
        <div id="inner-audio-chat">
          {peer && socket && (<VideoGrid updateMyStream={updateMyStream} myStream={myStream} name={name} newPeer={peer} socket={socket} sessionData={sessionData}/>)}
        </div>
        <div id="texting">
          <div id="texting-child">
            {socket && <MessageContainer socket={socket} roomId={roomId} /*sessionData={sessionData}*/ />}
          </div>
          <IndividualSessionData roomId={roomId} handleQuestionsfromChild={handleQuestionsfromChild}/>
            {/* {isRoomJoined && <p style={{color: "red"}}>Welcome.</p>} */}
        </div>
      </article>
          {/* Add more content sections as needed */}
        </div>
      )}
    </div>
      
    </>
  );
}

export default Room;