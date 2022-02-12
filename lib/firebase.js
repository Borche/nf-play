// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  signInWithPopup as s,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import {
  getFirestore,
  collection as c,
  getDocs as gd,
  serverTimestamp as timestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA75whQtwR2OmcWGXe6NIP3iNyfAoBDKqk',
  authDomain: 'nf-play-8ba06.firebaseapp.com',
  projectId: 'nf-play-8ba06',
  storageBucket: 'nf-play-8ba06.appspot.com',
  messagingSenderId: '83541048700',
  appId: '1:83541048700:web:a8b2b0f70303cc8f0ab8f9'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configure FirebaseUI.
const firebaseUIConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID, FacebookAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: (auth, redirectUrl) => {
      console.log('Andreas authar loss', auth, redirectUrl);
      return false;
    },
    signInFailure: error => console.log('Andreas errorar loss: ', error)
  }
};

export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const auth = getAuth();
export const signInWithPopup = s;
export const db = getFirestore(app);
export const collection = c;
export const getDocs = gd;
export const serverTimestamp = timestamp;
export const uiConfig = firebaseUIConfig;

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to json
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis()
  };
}
