// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

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

export { app, auth, database, analytics };
