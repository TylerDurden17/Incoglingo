import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';

const STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  ERROR: 'error'
};

function Matchmaker() {
  const user = useOutletContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let pollingInterval;

    if (status === STATUS.WAITING) {
      pollingInterval = setInterval(checkMatchStatus, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [status]);

  const handleError = (message) => {
    setStatus(STATUS.ERROR);
    setErrorMessage(message);
  };

  const checkMatchStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/matchmaking/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      if (data.matched) {
        setStatus(STATUS.IDLE);
        navigate(`/room/${data.roomId}`);
      }
    } catch (err) {
      handleError('Error checking match status. Please try again.');
    }
  };

  const startMatchmaking = async () => {
    try {
      setStatus(STATUS.WAITING);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/matchmaking/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      if (data.matched) {
        navigate(`/room/${data.roomId}`);
      } else {
        setStatus(STATUS.WAITING);
      }
    } catch (err) {
      handleError('Error joining queue. Please try again.');
    }
  };

  const leaveQueue = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/matchmaking/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      setStatus(STATUS.IDLE);
    } catch (err) {
      handleError('Error leaving queue. Please try again.');
    }
  };

  return (
    <div>
      <h1>Matchmaking System</h1>
      {status === STATUS.IDLE ? (
        <button onClick={startMatchmaking}>Find Partner</button>
      ) : status === STATUS.WAITING ? (
        <>
          <p>Waiting for a partner...You're in the queue!</p>
          <button onClick={leaveQueue}>Leave Queue</button>
        </>
      ) : (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}
    </div>
  );
}

export default Matchmaker;