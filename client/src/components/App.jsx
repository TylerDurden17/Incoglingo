import React from 'react';
import { Routes, Route } from "react-router-dom";
import Room from "./Room"; 
import Home from "./Home";
import Dashboard from "../main/dashboard";
import PrivateRoutes from './PrivateRoutes';
import Profile from "../main/pages/Profile"
import UserForm from "../main/userForm"
import Navbar from '../main/Navbar';

function App() {
return(
<>
  <Routes>

    <Route path="/" element={<Home />} />
    <Route path="/room" element={<Room />} />

    <Route element={<PrivateRoutes /> }>

      <Route element={<Navbar/>}>

        <Route index element={<Dashboard />} />
        
        <Route path="profile">

          <Route index element={<Profile />} />
          <Route path="editProfile" element={<UserForm />} />

        </Route>

      </Route>

    </Route>
         
  </Routes>
</>
)
}

export default App;