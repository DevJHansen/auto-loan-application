import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';

const {
  VITE_FIREBASE_API_KEY = '',
  VITE_FIREBASE_APP_ID = '',
  VITE_FIREBASE_SENDER_ID = '',
  VITE_FIREBASE_PROJECT_ID = '',
  VITE_APP_ENV = '',
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: `${VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: VITE_FIREBASE_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};


export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

if (VITE_APP_ENV === 'local') {
  connectAuthEmulator(auth, 'http://localhost:9990');
}

export const googleProvider = new GoogleAuthProvider();
