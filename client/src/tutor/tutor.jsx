import React from "react";
import { Button } from "react-bootstrap";
import CreateSessionItem from "./createSessionItem";
import { useOutletContext } from 'react-router-dom';

function Tutor() {

  const user = useOutletContext();

  const createSessionItem = () => {
    // TODO: Redirect to the session item page

  }

  return (
    <>
        <h1>Tutor</h1>
        <Button variant="secondary" onClick={createSessionItem}>Create Session Item</Button>
        
        <CreateSessionItem user={user} />

    </>
  )
}

export default Tutor;