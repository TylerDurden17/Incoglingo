import React, {useEffect} from "react";
import {Button} from 'react-bootstrap';
import MeetingTime from "./timeZone";
import { useNavigate } from 'react-router-dom';
import GoogleSignIn from "../auth/GoogleSignIn";
import { FcGoogle } from "react-icons/fc";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Home() {
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
}, []);

  const createRoom = () => {
    //const roomId = '4460ac02-28dc-491d-962e-f32897521715';
    navigate(`/room`);
  };
  return (
    <>
    <div style={{marginTop:'5%'}} id="home">
      <header style={{textAlign: "center"}}>
        <br></br>
        <div style={{fontSize:'4.5em', color:'#1A237E'}}>Incoglingo</div>
        <br></br>
      </header>
      <main>
        <div id={"intro"}>
          <article style={{ display: "grid", gridTemplateRows: "auto auto", gridRowGap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <section>
              Practice speaking English in an audio chat room, with other people.
            </section>
            <div style={{display:"flex", alignItems: "center", border: "1px solid #e7e7e7", width: "fit-content", borderRadius: "20px", padding: "6px 5px", 
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}>
              <FcGoogle style={{fontSize:"x-large"}}/>
              <GoogleSignIn/>
            </div>
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
            <hr/>
          </div>
            <div style={{padding:'10px', marginTop:'1%'}}>
            <h5 style={{fontWeight: '300'}} className="topic">Topic: {'What fictional character do you relate the most to? Why?'}</h5>
            <div className="topic-detail">{'5 January,'}</div>

      <MeetingTime/>
            </div>
        </div>
      </main>
    </div>


    </>
  );
}

export default Home;
