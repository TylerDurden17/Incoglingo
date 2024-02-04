import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate(); 

  const user = useOutletContext();

  if (user === null) {
    return <div>Loading...</div>;
  }

  const editProfile = () => {
    navigate('editProfile');
  }

  return (<>
    {user && 
      <>
        <div style={{display:'flex', margin: '10px', alignItems: "center", gap:"10px"}} className="profile-pic-container">
          <img referrerPolicy="no-referrer" style={{borderRadius: "50%"}} src={user.photoURL} alt={user.displayName} />
          <div className="profile-info">
            <h1>{user.displayName}!</h1>
            <h3>{user.email}</h3>
        <Button onClick={editProfile} variant="secondary">Edit profile</Button>
          </div>
        </div>
        
      </>
    }
    
  </>)
}

export default Profile;