import { Link, Outlet, useMatch, useResolvedPath, useOutletContext } from "react-router-dom"
import React from 'react';
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
  const user = useOutletContext();
  return (
    <>
      <nav className="nav">
        <Link to="/home" className="site-title">
          Incoglingo
        </Link>
        <ul>
          <CustomLink to="/profile">Profile</CustomLink>
        </ul> 
      </nav>

      <Outlet context={user}/>
    </>
    
  )
}

