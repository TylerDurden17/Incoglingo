import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
 
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  //<React.StrictMode> can help you find and fix potential problems in your application. It activates additional checks and warnings for common issues, and it is meant to be used during development only.
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  //</React.StrictMode>
);