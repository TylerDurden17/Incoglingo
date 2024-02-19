import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Tutor() {

  const navigate = useNavigate();
  const createSessionItem = () => {
    // TODO: Redirect to the session item page
    navigate('createsession');

  }
  
  return (
    <>
    <div style={{margin:'2rem'}} id="home">
      <Button variant="secondary" onClick={createSessionItem}>Create Session Item</Button>
    </div>
        
    </>
  )
}

export default Tutor;