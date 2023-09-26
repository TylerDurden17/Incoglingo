import React from "react";
import {Button} from 'react-bootstrap';
import Topic from "./topic";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const createRoom = () => {
    const roomId = '4460ac02-28dc-491d-962e-f32897521715';
    navigate(`/room/${roomId}`);
  };
  return (
    <>
    <div id="home">
      <header style={{textAlign: "center"}}>
        <h1>Incoglingo</h1>
        <br></br>
      </header>

      <main>
        <div style={{ display: "grid", placeItems: "center" }}>
          <article style={{ display: "grid", gridTemplateRows: "auto auto", gridRowGap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <section>
              Users can practice speaking English in an audio chat room, with other people.
            </section>
            <div style={{ display: "grid", justifyItems: "start" }}>
              <Button id="createRoomButton" onClick={createRoom}>
                Join Room
              </Button>
            </div>
          </article>
          <div style={{border:'1px solid #555', borderRadius:'16px', padding:'10px', marginTop:'4%'}}>
            <Topic/>
          </div>
        </div>
      </main>
    </div>


    </>
  );
}

export default Home;
