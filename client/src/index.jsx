import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import firebaseConfig from './auth/firebaseConfig'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './ queryClient';
//import ReactGA from 'react-ga4';
//ReactGA.initialize('G-JT0R0WW69E');
 
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
root.render(
  //<React.StrictMode> // can help you find and fix potential problems in your application. 
  //It activates additional checks and warnings for common issues, and it is meant to be used during development only.
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  //</React.StrictMode>
);