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
<p style={{textAlign:'center'}}>Subscriber count is coming soon!</p>
    <div style={{margin:'1rem', textAlign:'center'}} id="home">
      <Button variant="primary" onClick={createSessionItem}>Create Session Item</Button>
    </div>
    </>
  )
}

export default Tutor;