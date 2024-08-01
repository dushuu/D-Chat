import React from 'react';
import { Button, Typography } from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Import ref and set from firebase/database
import { auth, database } from './firebaseConfig'; // Ensure your firebaseConfig is correctly imported

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userRef = ref(database, `users/${user.uid}`);
        set(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      })
      .catch((error) => {
        console.error('Error signing in: ', error);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
      <Typography variant="body2" color="textSecondary" align="center" mt={2}>
        Do not violate the community guidelines or you will be banned for life!
      </Typography>
    </>
  );
}

export default SignIn;
