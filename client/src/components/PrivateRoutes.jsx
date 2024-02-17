import { Outlet, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsAuthenticated(!!user);
          setUser(user);
        });
    
        return () => unsubscribe();
    }, []);

    return isAuthenticated !== null ? (
      /* standard behavior to The Outlet it should not take any props */
        isAuthenticated ? <Outlet context={user} /> : <Navigate to="/" />
      ) : (
        <p>Loading...</p>
      );
}

export default PrivateRoutes;