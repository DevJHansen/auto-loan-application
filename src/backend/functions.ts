import { getNewAuthToken } from './firestoreUtils';
import axios, { AxiosResponse } from 'axios';

const { VITE_FUNCTIONS_URL = '' } = import.meta.env;

interface DocRequest {
  documentBase64: string;
  mimeType: string;
}

export interface ClassifyDocRes {
  confidence: number;
  type: string;
}

export const classifyDoc = async (
  docRequest: DocRequest
): Promise<ClassifyDocRes[]> => {
  try {
    const userToken = await getNewAuthToken();
    const res: AxiosResponse<ClassifyDocRes[]> = await axios.post(
      `https://classifydocument${VITE_FUNCTIONS_URL}`,
      docRequest,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Error classifying document');
  }
};
