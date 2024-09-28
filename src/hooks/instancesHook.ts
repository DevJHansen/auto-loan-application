import { atom, useRecoilState } from 'recoil';
import { ExtractionInstance } from '../types/extraction';
import { firestoreDB } from '../backend/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../constants/firebaseConstants';
import { useEffect } from 'react';

export const extractionInstancesState = atom<ExtractionInstance[]>({
  key: 'extractionInstancesState',
  default: [],
});

export const useInstances = () => {
  const [instances, setInstances] = useRecoilState(extractionInstancesState);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestoreDB, EXTRACTION_INSTANCE_COLLECTION),
      (collection) => {
        if (collection.empty) {
          return;
        }

        const docs = collection.docs.map((doc) => ({
          ...(doc.data() as ExtractionInstance),
        }));

        setInstances(docs.sort((a, b) => b.createdAt - a.createdAt));
      }
    );

    return () => unsubscribe();
  }, [setInstances]);

  return instances;
};
