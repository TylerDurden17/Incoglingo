import React, {useState, useEffect} from 'react';
import { getAuth, GoogleAuthProvider, signInWithRedirect/* , signInWithPopup */ } from 'firebase/auth';
import {Button} from 'react-bootstrap';

const GoogleSignIn = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || window.opera;
    setIsInAppBrowser(
      ua.indexOf("FBAN") > -1 || 
      ua.indexOf("FBAV") > -1 || 
      ua.indexOf("Instagram") > -1 ||
      ua.indexOf("Twitter") > -1 ||
      ua.indexOf("Line") > -1
    );
  }, []);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sign in with Google
      // const result = await signInWithPopup(auth, provider);
      const result = await signInWithRedirect(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      // Redirect to the dashboard after successful sign-in
      // navigate('/dashboard'); 

      // IdP data available using getAdditionalUserInfo(result)
      // ...

      console.log('User signed in with Google:', user);
    } catch (error) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          setError('Sign-in failed. Please try opening this page in your default browser.');
        }
      } else {
        setError('An error occurred during sign-in. Please try again.');
      }
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      // The email of the user's account used.
      const email = error.email;

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      // Log the error details
      console.error('Error signing in with Google:', errorCode, errorMessage, email, credential);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const openInBrowser = () => {
    const currentURL = window.location.href;
    if (/android/i.test(navigator.userAgent)) {
      // Android intent for opening in Chrome
      window.location.href = `intent://${currentURL.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      // iOS - try opening in Safari
      window.location.href = currentURL;
    } else {
      // Fallback - open in a new tab
      window.open(currentURL, '_blank');
    }
  };

  if (isInAppBrowser) {
    return (
      <div className="p-4 max-w-md mx-auto bg-yellow-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">In-App Browser Detected</h2>
        <p className="mb-4">
          For the best experience and to ensure successful sign-in, please open this page in your default mobile browser.
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button
            onClick={openInBrowser}
            style={{marginLeft:"2px"}}
          >
            Open in Browser
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button 
        style={{border:"none", background:"none"}} 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

export default GoogleSignIn;
