// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCU9b1QuuUqyF182KXjlQkdXcjY9hqzk1c",
  authDomain: "proyectoig.firebaseapp.com",
  projectId: "proyectoig",
  storageBucket: "proyectoig.firebasestorage.app",
  messagingSenderId: "728569311742",
  appId: "1:728569311742:web:9fb6e3881efdba776310af",
  measurementId: "G-4HXSTHKENY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)

export {auth, analytics, db}