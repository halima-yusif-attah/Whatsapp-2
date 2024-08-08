import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, serverTimestamp  } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "whatsapp-2-ff138.firebaseapp.com",
  projectId: "whatsapp-2-ff138", 
  storageBucket: "whatsapp-2-ff138.appspot.com",
  messagingSenderId: "232507920949",
  appId: "1:232507920949:web:0672aae103b683d4b7977c"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { db, auth, provider, signInWithPopup, serverTimestamp  };
