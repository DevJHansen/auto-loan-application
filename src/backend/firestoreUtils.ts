import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestoreDB } from './firestore';
import { auth } from './firebase';

/**
 * @description Update a document in a collection in firestore
 * @param collectionName the name of the collection the doc is in
 * @param documentId the id of the document to update
 * @param data the data to update the document with
 */
export const updateFirestoreDocument = async (
  collectionName: string,
  documentId: string,
  data: Partial<unknown>
) => {
  const docRef = doc(firestoreDB, collectionName, documentId);
  await setDoc(docRef, data, { merge: true });
};

/**
 * @description Create a document in a collection in firestore
 * @param collectionName the name of the collection the doc is in
 * @param documentId the id of the document to create
 * @param data the data to create the document with
 */
export const createFirestoreDocument = async (
  collectionName: string,
  documentId: string,
  data: Partial<unknown>
) => {
  const docRef = doc(firestoreDB, collectionName, documentId);

  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    await setDoc(docRef, data);
    return true;
  }
  return false;
};

/*
 * @description Get a new auth token from firebase
 */
export const getNewAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true); // Passing true forces refresh
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting auth token', error);
    return null;
  }
};
