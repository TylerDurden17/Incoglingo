import React from "react";
import {Button} from 'react-bootstrap';
import Topic from "./topic";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const createRoom = () => {
    //const roomId = '4460ac02-28dc-491d-962e-f32897521715';
    navigate(`/room`);
  };
  return (
    <>
    <div id="home">
      <header style={{textAlign: "center"}}>
        <br></br>
        <div style={{fontSize:'4.5em'}}>Incoglingo</div>
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
          <div>
      <label>Join the Facebook group:</label> {' '}
      <a
        href="https://www.facebook.com/groups/incoglingo/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Incoglingo
      </a>
    </div>
            <div style={{border:'1px solid #555', borderRadius:'16px', padding:'10px', marginTop:'1%'}}>
            <Topic/>
          </div>
        </div>
      </main>
    </div>


    </>
  );
}

export default Home;
