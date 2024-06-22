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
  const [roomId, setRoomId] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let pollingInterval;

    if (status === STATUS.WAITING) {
      pollingInterval = setInterval(checkForMatch, 5000); // Poll every 5 seconds
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

  const checkForMatch = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/matchmaking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.matched) {
        setRoomId(data.roomId);
        setStatus(STATUS.IDLE);
        navigate(`/room/${data.roomId}`);
      }
    } catch (err) {
      handleError('Error checking for match. Please try again.');
    }
  };

  const startMatchmaking = async () => {
    setStatus(STATUS.WAITING);
    checkForMatch();
  };

  return (
    <>
      <div>
        <h1>Matchmaking System</h1>
        {status === STATUS.IDLE ? (
          <button onClick={startMatchmaking}>Find Partner</button>
        ) : status === STATUS.WAITING ? (
          <p>Waiting for a partner...You're in the queue!</p>
        ) : (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        {roomId && <p>Match found Redirecting to chat room {roomId}</p>}
      </div>
    </>
  );
}

export default Matchmaker;