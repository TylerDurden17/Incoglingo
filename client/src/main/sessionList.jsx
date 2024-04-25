import React, {useState, useEffect} from 'react';
import {ToastContainer, toast } from 'react-toastify';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './sessionList.css';
import { useQueries } from '@tanstack/react-query';

function SessionList() {
  const navigate = useNavigate();
  
  const user = useOutletContext();
  const [mergedSessions, setMergedSessions] = useState([]);


  const fetchSessions = async () => {
    const response = await fetch('http://localhost:8080/sessions/latest');
    return response.json();
  };
  
  const fetchBookedSessions = async () => {
    const response = await fetch(`http://localhost:8080/sessions/booked/${user.uid}`);
    return response.json();
  };

  const combinedResults = useQueries({
    queries: [
      { queryKey: ['sessions'], queryFn: fetchSessions, enabled: !!user.uid },
      { queryKey: ['bookedSessions'], queryFn: fetchBookedSessions, enabled: !!user.uid },
    ],
    combine: (results) => {
      return {
        sessions: results[0].data,
        bookedSessions: results[1].data,
        error: results.some((result) => result.error),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
  const { sessions, bookedSessions, error, isLoading } = combinedResults;


  useEffect(() => {
    const asd = async () => {
  
        // Merge sessions and booked sessions
        console.log(sessions);
        if (sessions && bookedSessions) {
          // Merge sessions and booked sessions
          console.log(sessions);
          const mergedSessions = sessions.map((session) => ({
            ...session,
            isBooked: bookedSessions.includes(session.id),
          }));
          setMergedSessions(mergedSessions);
        }

        // setMergedSessions(mergedSessions);

        console.log(mergedSessions);

    };
  
    asd();
  }, [sessions, bookedSessions, user.uid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleJoinSession = async (session) => {
    const videoConferenceRoomURL = `/room/${session.roomId}`;
    navigate(videoConferenceRoomURL, { state: { data: JSON.stringify(session) } });
  }

  // Inside your React component
  const handleBookSession = async (sessionId) => {
    try {
      const response = await fetch('http://localhost:8080/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, learnerId: user.uid }),
      });
  
      if (response.ok) {
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
  <h2 id="sessions-header">Your Sessions</h2><hr />
  {
    mergedSessions.map((session) => (
      <div key={session.id} className="session-card">
        <h3>{session.topic}</h3>
        <p>{session.description}</p>
        <p>{session.timing}</p>
        {session.isBooked ? (
          <button onClick={() => handleJoinSession(session)} className="join-btn">Join</button>
        ) : (
          <button onClick={() => handleBookSession(session.id)} className="book-btn">Book</button>
        )}
      </div>
    ))
  }
</div>
      </>
  )

}

export default SessionList;