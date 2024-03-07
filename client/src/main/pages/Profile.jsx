import React, {useState, useEffect} from 'react';
import { Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MdVerified } from "react-icons/md";

function Profile() {
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate(); 

  const user = useOutletContext();

  if (user === null) {
    return <div>Loading...</div>;
  }

  const editProfile = () => {
    navigate('editProfile');
  }

  useEffect(() => {

    user.getIdTokenResult()
    .then((idTokenResult) => {
       // Confirm the user is an Admin.
       setAdmin(!!idTokenResult.claims.admin);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [])

  return (<>
    {user && 
      <>
      <div className='parentProfile' style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        <div style={{display:'flex', padding: '10px', alignItems: "center", gap:"10px"}} className="profile-pic-container">
            <img referrerPolicy="no-referrer" style={{borderRadius: "50%"}} src={user.photoURL} alt={user.displayName} />
            <div className="profile-info">
              <div className='name'>
                <h1>{user.displayName}{admin && <MdVerified style={{color: "rgb(0, 149, 246)"}} />}</h1>
              </div>
              <Button onClick={editProfile} variant="secondary">Edit profile</Button>
            </div>
        </div>
      </div>
        
      </>
    }
    
  </>)
}

export default Profile;