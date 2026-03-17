// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// PASTE YOUR CONFIG OBJECT HERE (From the Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAvGivBpzLppWjmIg1jGC_8TIGdMLirCP8",
  authDomain: "autosettle-a5fb6.firebaseapp.com",
  projectId: "autosettle-a5fb6",
  storageBucket: "autosettle-a5fb6.firebasestorage.app",
  messagingSenderId: "194973486584",
  appId: "1:194973486584:web:075831cecbcf5c9c695a0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools we need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);