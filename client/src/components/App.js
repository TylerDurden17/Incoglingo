import React from 'react';
import { Routes, Route } from "react-router-dom";
import Room from "./Room"; 
import Home from "./Home"; 

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </>
    )
}

export default App;