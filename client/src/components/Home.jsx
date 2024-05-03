import React, {useEffect, useState} from "react";
import {Button} from 'react-bootstrap';
import MeetingTime from "./timeZone";
import { useNavigate, Navigate } from 'react-router-dom';
import GoogleSignIn from "../auth/GoogleSignIn";
import { FcGoogle } from "react-icons/fc";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
}, []);

  const createRoom = () => {
    //const roomId = '4460ac02-28dc-491d-962e-f32897521715';
    navigate(`/room`);
  };

  const login = (
    <>
    <div style={{marginTop:'5%'}} id="home">
      

      <main>
        <div id={"intro"}>
          <article style={{ display: "grid", gridTemplateRows: "auto auto", gridRowGap: "10px", alignItems: "center", marginBottom: "10px" }}>
          <header style={{textAlign: "center"}}>
        <br/>
        <div style={{fontSize:'4em', color:'#1A237E'}}>Incoglingo</div>
        
      </header>
<section>
              Practice English in an audio chat room, with native teachers.
            </section>
      <div style={{display:"flex", alignItems: "center", border: "1px solid #e7e7e7", 
                    width: "fit-content", borderRadius: "20px", padding: "6px 5px", 
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", margin: "20px auto 40px"
                  }}>
        <FcGoogle style={{fontSize:"x-large"}}/>
        <GoogleSignIn/>
      </div>
         
          <hr/>   
            {/* <div style={{ display: "grid", justifyItems: "start" }}>
              <Button id="createRoomButton" onClick={createRoom}>
                Join Room
              </Button>
            </div> */}

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
            {/* <div style={{padding:'10px', marginTop:'1%'}}>
            <h5 style={{fontWeight: '300'}} className="topic">Topic: {'What fictional character do you relate the most to? Why?'}</h5>
            <div className="topic-detail">{'5 January,'}</div>

      <MeetingTime/>
            </div> */}
        </div>
      </main>
    </div>


    </>
  );

  return isAuthenticated !== null ? (
    /* standard behavior to The Outlet it should not take any props */
      isAuthenticated ? <Navigate to="/home" replace={true}/> : login
    ) : (
      <p>Loading...</p>
    );
}

export default Home;
