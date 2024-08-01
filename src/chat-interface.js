// src/ChatInterface.js
import React, { useRef, useState, useEffect } from 'react';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import { Box, TextField, IconButton, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ChatInterface({ selectedUser }) {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [editMessage, setEditMessage] = useState(null);

  useEffect(() => {
    const chatId = getChatId(auth.currentUser.uid, selectedUser.uid);
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesList = [];
      for (let id in data) {
        messagesList.push({ id, ...data[id] });
      }
      setMessages(messagesList);

      // Mark messages as read
      const     updates = {};
      messagesList.forEach((msg) => {
        if (msg.uid !== auth.currentUser.uid && msg.unread) {
          updates[`/chats/${chatId}/messages/${msg.id}/unread`] = false;
        }
      });
      update(ref(database), updates);
    });
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const chatId = getChatId(auth.currentUser.uid, selectedUser.uid);
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const { uid, photoURL } = auth.currentUser;

    if (editMessage) {
      const updates = {};
      updates[`/chats/${chatId}/messages/${editMessage.id}`] = { text: formValue, uid, photoURL, createdAt: editMessage.createdAt, unread: false };
      update(ref(database), updates);
      setEditMessage(null);
    } else {
      await push(messagesRef, {
        text: formValue,
        createdAt: new Date().toISOString(),
        uid,
        photoURL,
        unread: true,
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
    const chatId = getChatId(auth.currentUser.uid, selectedUser.uid);
    remove(ref(database, `chats/${chatId}/messages/${id}`));
  };

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
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

export default ChatInterface;
