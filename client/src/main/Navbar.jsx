import { Link, Outlet, useMatch, useResolvedPath, useOutletContext } from "react-router-dom"
import React, {useEffect, useState} from 'react';
import "./navStyle.css"

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default function Navbar() {
  const [admin, setAdmin] = useState(false);
  const user = useOutletContext();
  

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

  return (
    <>
      <nav className="nav">
        <div style={{display:"flex", margin:'5px'}}>
        <Link style={{fontFamily:'ubuntumono', fontWeight:"800", color:'#007BFF'}} to="/home" className="site-title">incoglingo
        </Link></div>
        
        <ul>
          {admin && (
            <CustomLink to="/partner">Partner Dashboard</CustomLink>
          )}
          <CustomLink to="/profile">
              
              <img referrerPolicy="no-referrer" 
                style={{borderRadius: "50%", maxWidth:"2rem", marginRight:"0.5rem"}} src={user.photoURL} 
                  alt={user.displayName} 
              />
              Profile
            
          </CustomLink>
        </ul> 
      </nav>

      <Outlet context={user}/>
    </>
    
  )
}

