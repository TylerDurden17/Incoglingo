import React, {useState} from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const GoogleSignIn = () => {

  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);

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
