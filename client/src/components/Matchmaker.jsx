import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import "./Matchmaker.css"
import {Button} from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  ERROR: 'error'
};

function Matchmaker() {
  const auth = getAuth();
  const user = useOutletContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false); // Separate state for joining
  const [isLeaving, setIsLeaving] = useState(false); // Separate state for leaving
  
  const logout = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/'); 
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
  }

  const handleError = useCallback((message) => {
    setStatus(STATUS.ERROR);
    setErrorMessage(message);
  }, []);

  const navigateToRoom = useCallback((roomId) => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  const checkMatchStatus = useCallback(async () => {
    if (status !== STATUS.WAITING || !user?.uid) return;

    try {
      const response = await fetch(`${API_URL}/matchmaking/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      if (data.matched) {
        setStatus(STATUS.IDLE);
        navigateToRoom(data.roomId);
      }
    } catch (err) {
      handleError(`Error checking match status: ${err.message}`);
    }
  }, [status, user?.uid, navigateToRoom, handleError]);

  useEffect(() => {
    let intervalId;
    if (status === STATUS.WAITING) {
      intervalId = setInterval(checkMatchStatus, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, checkMatchStatus]);

  const startMatchmaking = async () => {
    if (!user?.uid) {
      handleError('User not authenticated');
      return;
    }
    setIsJoining(true);
    setStatus(STATUS.WAITING);
    try {
      const response = await fetch(`${API_URL}/matchmaking/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      if (data.matched) {
        setStatus(STATUS.IDLE);
        navigateToRoom(data.roomId);
      }
    } catch (err) {
      handleError(`Error joining queue: ${err.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  const leaveQueue = async () => {
    if (!user?.uid) {
      handleError('User not authenticated');
      return;
    }
    setIsLeaving(true); // Use isLeaving here
    try {
      await fetch(`${API_URL}/matchmaking/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      setStatus(STATUS.IDLE);
    } catch (err) {
      handleError(`Error leaving queue: ${err.message}`);
    } finally {
      setIsLeaving(false); // Reset isLeaving here
    }
  };

  if (!user) {
    return <p>Please log in to use the matchmaking system.</p>;
  }

  return (
    <div className="matchmaker-container">
      {status === STATUS.IDLE ? (
        <button className="matchmaker-button" onClick={startMatchmaking} disabled={isJoining}>
          {isJoining ? 'Finding Partner...' : 'Find Partner'}
        </button>
      ) : status === STATUS.WAITING ? (
        <>
          <p>Waiting for a partner...You're in the queue!</p>
          <button className="matchmaker-button secondary-button" onClick={leaveQueue} disabled={isLeaving}>
            {isLeaving ? 'Leaving Queue...' : 'Leave Queue'}
          </button>
        </>
      ) : (
        <p className="message error" style={{ color: 'red' }}>{errorMessage}</p>
      )}
      <footer>
            <Button style={{margin: "10px", position: "fixed", bottom: "0", left:"0"}} onClick={logout}>
                    Log out</Button>
        </footer>
    </div>
  );
}

export default Matchmaker;