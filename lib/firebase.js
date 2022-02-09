// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup as s, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection as c,
  getDocs as gd,
  serverTimestamp as timestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA75whQtwR2OmcWGXe6NIP3iNyfAoBDKqk",
  authDomain: "nf-play-8ba06.firebaseapp.com",
  projectId: "nf-play-8ba06",
  storageBucket: "nf-play-8ba06.appspot.com",
  messagingSenderId: "83541048700",
  appId: "1:83541048700:web:a8b2b0f70303cc8f0ab8f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth();
export const signInWithPopup = s;
export const db = getFirestore(app);
export const collection = c;
export const getDocs = gd;
export const serverTimestamp = timestamp;

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to json
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
