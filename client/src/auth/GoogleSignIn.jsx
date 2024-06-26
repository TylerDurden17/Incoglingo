import React, {useState, useEffect} from 'react';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const GoogleSignIn = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
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

  if (isInAppBrowser) {
    return (
      <div className="p-4 max-w-md mx-auto bg-yellow-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">In-App Browser Detected</h2>
        <p className="mb-4">
          For the best experience and to ensure successful sign-in, please open this page in your default mobile browser.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            const currentURL = window.location.href;
            if (navigator.share) {
              navigator.share({ url: currentURL });
            } else {
              window.location.href = `sms:&body=Check out this link: ${currentURL}`;
            }
          }}
        >
          Share Link
        </button>
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
