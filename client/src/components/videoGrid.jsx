import CallHandling from "./CallHandling";
import React, {useState} from 'react';
// import { useLocation } from 'react-router-dom';
import Topic from "./topic";
import Modal from "react-modal";
import {Button} from 'react-bootstrap';
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


function VideoGrid(props){
  //const location = useLocation();

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // useEffect(() => {
  //   // Track page view when the component is mounted or when the location changes
  //   window.gtag('event', 'page_view', { page_path: location.pathname });

  // }, [location]);
  
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
            <Topic sessionData={props.sessionData}/>

      </Modal>      
      <div className="ModalToDisplayTopic">
        <Button onClick={toggleModal}>See Questions</Button>
      </div>
        <CallHandling updateMyStream={props.updateMyStream} myStream={props.myStream} name={props.name} newPeer={props.newPeer} socket={props.socket}/>
      </>
    );
}


export default VideoGrid;