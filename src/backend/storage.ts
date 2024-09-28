import { firebaseApp } from './firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getMetadata,
  deleteObject,
  connectStorageEmulator,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { createDownloadLink } from './storageUtils';

const { VITE_FIREBASE_PROJECT_ID = '', VITE_APP_ENV = '' } = import.meta.env;

export const storage = getStorage(
  firebaseApp,
  `${VITE_FIREBASE_PROJECT_ID}.appspot.com`
);

if (VITE_APP_ENV === 'local') {
  const storagePort = 9991;
  connectStorageEmulator(storage, 'localhost', storagePort);
}

/**
 * @description Uploads a file to Google Cloud Storage.
 * @param path the path to the file
 * @param file the file to upload
 * @returns the path to the file, the status, the bucket and a download link
 */
export const uploadFile = async (
  path: string,
  file: File,
  fileName?: string
) => {
  try {
    const fileRef = ref(
      storage,
      `${path}/${+new Date() + (fileName ?? file.name)}`
    );

    await uploadBytesResumable(fileRef, file);
    const metaData = await getMetadata(fileRef);

    return {
      success: true,
      path,
      link: createDownloadLink(metaData.bucket, metaData.fullPath),
      bucket: metaData.bucket,
    };
  } catch (e) {
    console.error(e);
    return { success: false, path };
  }
};

export const uploadBase64File = async (
  path: string,
  base64String: string,
  mimeType: string,
  fileName?: string
) => {
  try {
    const storage = getStorage();
    const fileRef = ref(
      storage,
      `${path}/${+new Date() + (fileName ?? 'uploaded_file')}`
    );

    const dataUrl = `data:${mimeType};base64,${base64String}`;

    await uploadString(fileRef, dataUrl, 'data_url');

    const metaData = await getMetadata(fileRef);

    const gcsUri = `gs://${metaData.bucket}/${metaData.fullPath}`;

    return {
      success: true,
      path,
      link: createDownloadLink(metaData.bucket, metaData.fullPath),
      bucket: metaData.bucket,
      gcsUri,
    };
  } catch (e) {
    console.error(e);
    throw new Error('Error uploading file');
  }
};

/**
 * @description Uploads a file to Google Cloud Storage.
 * @param path the path to the file
 * @param file the file to upload
 * @returns the path to the file
 */
export const uploadFileAdReturnLink = async (path: string, file: File) => {
  try {
    const fileRef = ref(storage, `${path}/${+new Date() + file.name}`);

    await uploadBytesResumable(fileRef, file);
    const metaData = await getMetadata(fileRef);

    return createDownloadLink(metaData.bucket, metaData.fullPath);
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * @description Deletes a file from Google Cloud Storage.
 * @param path the path to the file
 * @returns the result of the operation
 */
export const deleteFile = async (path: string) => {
  try {
    const fileRef = ref(storage, path);

    await deleteObject(fileRef);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export async function getAuthedFileUrl(urlString: string): Promise<string> {
  const parsedUrl = new URL(urlString);

  const fileRef = ref(
    storage,
    parsedUrl.pathname.replace('/wa-hr-f072a.appspot.com', '')
  );

  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching file path');
  }
}
