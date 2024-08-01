// src/App.js
import React, { useState } from 'react';
import { Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import UserList from './userlist';
import ChatInterface from './chat-interface';
import SignIn from './signin';
import SignOut from './sign-out';
function App() {
  const [user] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Container maxWidth="sm">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ⚛️🔥💬
          </Typography>
          {user && <SignOut />}
        </Toolbar>
      </AppBar>
      <Box my={4} pt={8}>
        <Box mt={2}>
          {user ? (
            selectedUser ? (
              <ChatInterface selectedUser={selectedUser} />
            ) : (
              <UserList onSelectUser={setSelectedUser} />
            )
          ) : (
            <SignIn />
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
