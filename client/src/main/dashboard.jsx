import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useOutletContext } from 'react-router-dom';
import {Button} from 'react-bootstrap';
// import SelectPartners from "./selectPartners";
// import { DiscussionEmbed } from 'disqus-react';
import './dashboard.css';
import SessionList from "./sessionList";

function Dashboard() {
      
    const auth = getAuth();
    const user = useOutletContext();
    console.log(user);
    const navigate = useNavigate();

    const logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate('/'); 
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }

    // useEffect(() => {
    //     fetch('http://localhost:8080/getProfileData', {
            
    //     })
    // },[])
    return (
        <>
        <div style={{position:"fixed", right:"0", paddingRight:"15px"}} className="sessionList">
            <p>Complete your profile</p>
        </div>

        <br></br>
        <br></br>

        <div className="thehome">
                {/* <div className="discussion-embed">
                    <DiscussionEmbed
                        shortname='example'
                    />
                </div> */}
        {/* <div className="select-partners">
            <SelectPartners learnerId = {user.uid}/>
        </div> */}
        <div><SessionList/></div>
                
        </div>
        
        <footer>
            <Button style={{margin: "10px", position: "fixed", bottom: "0"}} onClick={logout}>
                    Log out</Button>
        </footer>
            
        </>
    )
}

export default Dashboard;