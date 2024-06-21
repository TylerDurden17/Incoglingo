import React, {useState} from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';

function Matchmaker() {    
    const user = useOutletContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [roomId, setRoomId] = useState(null);

    const startMatchmaking = async () => {
        setIsWaiting(false);
        setError(null);
      
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/join-queue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }),
          });
          const data = await response.json();
          if(data.matched) {
            // Immediate match found
            setRoomId(data.roomId);
            console.log('set roomId:'+data.roomId);
            navigate(`/room/${data.roomId}`);
          }
          else if (data.waitingInQueue) {
            // No match yet, user is in queue
            setIsWaiting(true);
            console.log('waiting');
          }
          else {
            setError('Unexpected response from server. Please try again.');
        }
        } catch (err) {
          setError('Failed to connect to the server. Please try again.');
          setIsWaiting(false);
        }
    };

    return (
    <>
        <div>
            <h1>Matchmaking System</h1>
            {!isWaiting ? (
                <button onClick={startMatchmaking}>Find Partner</button>
            ) : (
                <p>Waiting for a partner...You're in the queue!</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {roomId && <p>Match found Redirecting to chat room {roomId}</p>}
        </div>
    </>
    );
  }

export default Matchmaker;