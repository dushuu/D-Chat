import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { useAuthState } from 'react-firebase-hooks/auth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// Add your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyD_dwK1fzE-tixpTLFyvdhTovm3fkCPK98",
  authDomain: "chat-74ff8.firebaseapp.com",
  projectId: "chat-74ff8",
  storageBucket: "chat-74ff8.appspot.com",
  messagingSenderId: "1016891677306",
  appId: "1:1016891677306:web:1cc43990aaf952dede39c3",
  measurementId: "G-YR7JC47095",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

function App() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    requestPermission();

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  }, []);

  return (
    <Container maxWidth="sm">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ⚛️🔥💬
          </Typography>
          <SignOut />
        </Toolbar>
      </AppBar>
      <Box my={4} pt={8}>
        <Box mt={2}>
          {user ? <ChatRoom /> : <SignIn />}
        </Box>
      </Box>
    </Container>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
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

function SignOut() {
  return (
    auth.currentUser && (
      <Button variant="outlined" color="secondary" onClick={() => signOut(auth)}>
        Sign Out
      </Button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = ref(database, 'messages');
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [editMessage, setEditMessage] = useState(null);

  useEffect(() => {
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesList = [];
      for (let id in data) {
        messagesList.push({ id, ...data[id] });
      }
      setMessages(messagesList);
    });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if (editMessage) {
      const updates = {};
      updates[`/messages/${editMessage.id}`] = { text: formValue, uid, photoURL, createdAt: editMessage.createdAt };
      update(ref(database), updates);
      setEditMessage(null);
    } else {
      await push(messagesRef, {
        text: formValue,
        createdAt: new Date().toISOString(),
        uid,
        photoURL,
      });
    }

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEdit = (message) => {
    setFormValue(message.text);
    setEditMessage(message);
  };

  const handleDelete = (id) => {
    remove(ref(database, `messages/${id}`));
  };

  return (
    <>
      <Box my={2}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        <span ref={dummy}></span>
      </Box>

      <form onSubmit={sendMessage}>
        <TextField
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something nice"
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton type="submit" color="primary" disabled={!formValue}>
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </form>
    </>
  );
}

function ChatMessage({ message, onEdit, onDelete }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <Box className={`message ${messageClass}`} mb={2}>
      <Avatar src={photoURL} alt="User Avatar" />
      <Box>
        <Typography component="p">{text}</Typography>
        {uid === auth.currentUser.uid && (
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={() => onEdit(message)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(message.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
