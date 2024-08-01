// src/UserList.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database, auth } from './firebaseConfig';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Badge } from '@mui/material';

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    // Fetch users from the database
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userList = [];
      for (let uid in data) {
        userList.push({ uid, ...data[uid] });
      }
      setUsers(userList);
    });

    // Listen for new messages and update unread counts
    const messagesRef = ref(database, 'chats');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const counts = {};
      for (let chatId in data) {
        const chat = data[chatId];
        for (let messageId in chat.messages) {
          const msg = chat.messages[messageId];
          if (msg.uid !== auth.currentUser.uid && msg.unread) {
            const otherUserId = chatId.split('_').find(id => id !== auth.currentUser.uid);
            counts[otherUserId] = (counts[otherUserId] || 0) + 1;
          }
        }
      }
      setUnreadCounts(counts);
    });
  }, []);

  return (
    <List>
      {users.map((user) => (
        <ListItem button key={user.uid} onClick={() => onSelectUser(user)}>
          <ListItemAvatar>
            <Badge badgeContent={unreadCounts[user.uid] || 0} color="error">
              <Avatar src={user.photoURL} alt={user.displayName} />
            </Badge>
          </ListItemAvatar>
          <ListItemText primary={user.displayName} />
        </ListItem>
      ))}
    </List>
  );
}

export default UserList;
