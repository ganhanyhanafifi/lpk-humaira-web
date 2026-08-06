import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDelNwl-q5tx6VJunEo4zVFuhv3vk8fHg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lpk-humaira-web.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lpk-humaira-web',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lpk-humaira-web.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '357193438990',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:357193438990:web:eaffe044ca5d9d8aefa95f',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
