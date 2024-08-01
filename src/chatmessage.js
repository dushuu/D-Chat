// src/ChatMessage.js
import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { auth } from './firebaseConfig';

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

export default ChatMessage;
