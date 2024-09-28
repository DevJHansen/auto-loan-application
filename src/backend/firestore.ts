import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseApp } from './firebase';

const {
  VITE_APP_ENV = '',
} = import.meta.env;

export const firestoreDB = getFirestore(firebaseApp);

if (VITE_APP_ENV === 'local') {
  const FIRESTORE_PORT = 5002;
  connectFirestoreEmulator(firestoreDB, 'localhost', FIRESTORE_PORT);
}
