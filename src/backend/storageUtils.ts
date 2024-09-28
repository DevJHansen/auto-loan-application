import { getDownloadURL, ref } from 'firebase/storage';
import { GOOGLE_STORAGE_LINK } from '../constants/firebaseConstants';
import { storage } from './storage';

/**
 * Creates a download link for a file in Google Cloud Storage.
 *
 * @param bucket The storage bucket
 * @param path The path to the file
 * @returns Google Cloud Storage download link
 */
export const createDownloadLink = (bucket: string, path: string) => {
  if (bucket === '') {
    console.warn('Storage bucket was empty: ' + bucket);
  }

  if (path === '') {
    console.warn('Path was empty: ' + path);
  }

  return `${GOOGLE_STORAGE_LINK}/${bucket}/${path}`;
};

function parseGCSUri(gcsUri: string) {
  const matches = gcsUri.match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!matches) {
    throw new Error('Invalid GCS URI format');
  }
  const [, bucketName, filePath] = matches;
  return { bucketName, filePath };
}

export const getFileDownloadUrl = async (gcsUri: string) => {
  try {
    const { filePath } = parseGCSUri(gcsUri);

    const fileRef = ref(storage, filePath);

    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error fetching download URL:', error);
    throw error;
  }
};
