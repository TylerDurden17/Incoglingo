import React, {useState, useEffect} from 'react';
import {ToastContainer, toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

function SessionList() {
  
  const user = useOutletContext();
  const [mergedSessions, setMergedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch the latest 10 sessions
        const sessionsResponse = await fetch('http://localhost:8080/sessions/latest');
        const sessionsList = await sessionsResponse.json();
  
        //Fetch the booked session IDs for the learner
        const bookedSessionsResponse = await fetch(`http://localhost:8080/sessions/booked/${user.uid}`);
        const bookedSessionIds = await bookedSessionsResponse.json();
  
        // Merge sessions and booked sessions
        const mergedSessions = sessionsList.map((session) => ({
          ...session,
          isBooked: bookedSessionIds.includes(session.id),
        }));  

        setMergedSessions(mergedSessions);

        setIsLoading(false);
  
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading state to false in case of an error
      }
    };
  
    fetchData();
  }, [user.uid]);

  const handleJoinSession = async () => {}

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
          <div>
              <h2>Sessions</h2>
              {isLoading ? (
                <div>Loading sessions...</div>
              ) : (
              mergedSessions.map((session) => (
                <div key={session.id}>
                  <h3>{session.topic}</h3>
                  <p>{session.description}</p>
                  {session.isBooked ? (
                    <button onClick={() => handleJoinSession(session.id)}>Join</button>
                  ) : (
                    <button onClick={() => handleBookSession(session.id)}>Book</button>
                  )}
                </div>
              )))}
          </div>
      </>
  )

}

export default SessionList;