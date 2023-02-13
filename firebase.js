// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7_xDvBBYS1mOXYsq8GTZDZxbtHS1A4QQ",
  authDomain: "twitter-clone-fdf1b.firebaseapp.com",
  projectId: "twitter-clone-fdf1b",
  storageBucket: "twitter-clone-fdf1b.appspot.com",
  messagingSenderId: "68593438286",
  appId: "1:68593438286:web:9fc83c7d5c01efa269fd1f"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore ();
const storage = getStorage();
export { app,auth, db, storage };
