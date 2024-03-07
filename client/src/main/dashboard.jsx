import React, {useState, useEffect} from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useOutletContext } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import SelectPartners from "./selectPartners";
import { DiscussionEmbed } from 'disqus-react';
import PlanSelection from "./planSelection";

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
        <div style={{margin:"auto", width:"20%", textAlign:"center", padding:"10px"}} className="sessionList">
            <p>Complete your profile</p>
        </div>

        <div style={{margin:"0 auto", width: "400px", textAlign:"center"}}>
                <SelectPartners/>
                <PlanSelection email={user.email}/>
        </div>

        <div style={{width:"600px", marginBottom: "100px"}}>
            {/* <DiscussionEmbed
            shortname='example'
        /> */}
        </div>
        
            <Button style={{margin: "10px", position: "absolute", bottom: "0"}} onClick={logout}>
                    Log out</Button>
        </>
    )
}

export default Dashboard;