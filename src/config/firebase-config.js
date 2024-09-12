import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOSCpo4oCaP6GHajA_jB2Y2LuUA5I8NpI",
  authDomain: "reactproject-aeda3.firebaseapp.com",
  projectId: "reactproject-aeda3",
  storageBucket: "reactproject-aeda3.appspot.com",
  messagingSenderId: "809870172376",
  appId: "1:809870172376:web:f761942c0aedf83855b7ad",
  databaseURL: "https://reactproject-aeda3-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);