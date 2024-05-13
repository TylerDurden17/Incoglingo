import React, {useState, useEffect} from 'react';
import {ToastContainer, toast } from 'react-toastify';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import './sessionList.css';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import Modal from "react-modal";
import Attendees from './attendees';

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

function SessionList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const user = useOutletContext();
  const [mergedSessions, setMergedSessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchSessions = async () => {
    const response = await fetch('https://incoglingo.onrender.com/sessions/latest');
    return response.json();
  };

  const combinedResults = useQueries({
    queries: [
      { queryKey: ['sessions'], queryFn: fetchSessions, enabled: !!user.uid },
    ],
    combine: (results) => {
      return {
        sessions: results[0].data,
        error: results.some((result) => result.error),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
  const { sessions, error, isLoading } = combinedResults;


  useEffect(() => {
    const merge = async () => {
      if (sessions && sessions.length > 0) {
        const mergedSessions = sessions.map((session) => ({
          ...session,
          isBooked: session.attendees?.some((attendee) => attendee.learnerId === user.uid),
        }));
        setMergedSessions(mergedSessions);
      } else {
        setMergedSessions([]);
      }
    };
  
    merge();
  }, [sessions, user.uid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleJoinSession = async (session) => {
    const videoConferenceRoomURL = `/room/${session.roomId}`;
    navigate(videoConferenceRoomURL/*, { state: { data: JSON.stringify(session) } }*/);
  }

  // Inside your React component
  const handleBookSession = async (sessionId) => {
    try {
      const response = await fetch('https://incoglingo.onrender.com/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, learnerId: user.uid, displayName: user.displayName, email: user.email }),
      });
  
      if (response.ok) {

        queryClient.invalidateQueries({ queryKey: ['sessions']});
        // Show success notification
        toast.success('Session booked successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme:"dark",
          progress: undefined,
        });

        // Update the mergedSessions state to reflect the booking
        setMergedSessions((prevMergedSessions) =>
          prevMergedSessions.map((session) =>
            session.id === sessionId ? { ...session, isBooked: true } : session
          )
        );
      } else {
        const { error } = await response.json();
        // Show error notification
        toast.error(error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme:"dark"
        });
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('An error occurred while booking the session.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:"dark"
      });
    }
  };

  return (
      <>
      <ToastContainer/>
      <div className="sessions-container">
      <h2 id="sessions-header">Sessions</h2><hr />
      {
        mergedSessions.map((session) => (
          <div key={session.id} className="session-card">
            <h3>{session.topic}</h3>
            <p>{session.description}</p>
            <Link to={`/${session.organizer.organizerId}`}>{session.organizer.organizerName}</Link>
            <p>{session.timing}</p>
            {/* <p>Booked Seats: {session.bookedSeats}</p> */}
            <button className="session-btn" onClick={() => setModalOpen(true)}>View Attendees</button>
            <Modal
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              contentLabel="Attendees"
              className="modalSession"
              overlayClassName="modal-overlay"
              ariaHideApp={false}
              shouldCloseOnOverlayClick={false} // Prevent closing on click outside
              style={customModalStyles}
            >
              <h2>Attendees</h2>
              <button style={customModalStyles.closeButton} onClick={() => setModalOpen(false)}>&times;</button>
              <Attendees attendees={session.attendees || []} />
            </Modal>
            {session.isBooked ? (
              <button onClick={() => handleJoinSession(session)} className="session-btn">Join</button>
            ) : (
              <button onClick={() => handleBookSession(session.id)} className="session-btn">Book</button>
            )}
          </div>
        ))
      }
</div>
      </>
  )

}

export default SessionList;