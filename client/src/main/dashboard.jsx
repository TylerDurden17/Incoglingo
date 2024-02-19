import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap';

function Dashboard() {
    const auth = getAuth();
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
    return (
        <>
            <Button style={{margin: "10px", position: "absolute", bottom: "0"}} onClick={logout}>
                    Log out</Button>
        </>
    )
}

export default Dashboard;