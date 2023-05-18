import React from "react";
//import { useNavigate } from "react-router-dom";
//import { v4 as uuidV4 } from 'uuid';
import {Button} from 'react-bootstrap';

function Home() {
  //const navigate = useNavigate();
  const createRoom = () => {
    //const roomId = uuidV4();
    //navigate(`/room/${roomId}`);
    window.location.href = `/room/4460ac02-28dc-491d-962e-f32897521715`;
  };
console.log('ha');
  return (
    <>
    <div id="home">
      <header style={{textAlign: "center"}}>
        <h1>TalkX</h1>
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
        </div>
      </main>
    </div>


    </>
  );
}

export default Home;
