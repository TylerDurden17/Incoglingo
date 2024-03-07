import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const Profiles = () => {
    const { userId } = useParams(); // This hook gives you access to the parameters of the current route.
    return <div>User Profile for ID: {userId}</div>;
  };

export default Profiles;