// src/SignOut.js
import React from 'react';
import { auth } from './firebaseConfig';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';

function SignOut() {
  return (
    auth.currentUser && (
      <Button variant="outlined" color="secondary" onClick={() => signOut(auth)}>
        Sign Out
      </Button>
    )
  );
}

export default SignOut;
