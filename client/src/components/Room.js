import React, {useEffect, useState} from "react";
import {Button} from 'react-bootstrap';
import './Room.css';
import { useParams } from 'react-router-dom';
import {socket} from '../socket'
import MessageContainer from "./messageContainer";
import newPeer from "../peerobj";
import VideoGrid from "./videoGrid";
import Topic from "./topic";
import Modal from "react-modal";
const customModalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '9px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    border: 'none', // If you want to remove the border completely
    maxWidth: '600px', // Adjust the width of the modal as per your design
    maxHeight: '50%', // Adjust the width of the modal as per your design
    padding: '20px', // Customize the padding inside the modal
    backgroundColor: '#fff', // Customize the background color of the modal
    overflowY: 'scroll',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    backdropFilter: 'blur(2px)', // Apply a blur effect
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Higher than other elements
  },
  closeButton: {
    position: 'absolute',
    top: '-16px',
    right: '4px',
    border: 'none',
    fontSize: '36px',
    background: 'transparent',
    // Add more styles as needed
  },

  // Media query for mobile
  '@media (max-width: 768px)': {
    content: {
      backgroundColor: 'red'
    }
  },
};


function Room() {
  
  
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const naam = window.prompt('What is your name?');

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
        console.log('room joined with name:', naam);
    });

    newPeer.on('disconnected', handleDisconnect);

    return () => {
      newPeer.off('disconnected', handleDisconnect);
      newPeer.destroy();
    };
  }, [roomId, naam]);

  return (
    <>

      <Modal 
          isOpen={showModal}
          onRequestClose={toggleModal}
          className="modal-content"
          overlayClassName="modal-overlay"
          ariaHideApp={false}
          //shouldCloseOnOverlayClick={false} // Prevent closing on click outside
          //shouldCloseOnEsc={false} // Prevent closing on escape key
          style={customModalStyles}
      >
            <button style={customModalStyles.closeButton} className="modal-close" onClick={toggleModal}>
              &times;
            </button>
            <Topic/>

      </Modal>
      <header>
        <h4 id="groupName">Incoglingo</h4>
      </header>

      <article id="bothchats">

        <div id="inner-audio-chat">
            <VideoGrid naam={naam} />
        </div>

        <div id="texting">
          <div id="texting-child">
            {/* display the list of connected users*/}
            <MessageContainer/>
          </div>

        </div>
        
      </article>
      
      <div className="ModalToDisplayTopic">
        <Button onClick={toggleModal}>See Questions</Button>
      </div>


    </>
  );
}

export default Room;