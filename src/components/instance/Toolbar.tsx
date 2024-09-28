import { useRecoilState } from 'recoil';
import { extractionInstanceState } from './recoil';
import { firestoreDB } from '../../backend/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../../constants/firebaseConstants';
import { doc, updateDoc } from 'firebase/firestore';
import { useAddToast } from '../../hooks/toastHooks';

export const Toolbar = () => {
  const [instance, setInstance] = useRecoilState(extractionInstanceState);
  const addToast = useAddToast();

  if (instance?.status !== 'review') {
    return;
  }

  const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
    try {
      const docRef = doc(
        firestoreDB,
        `${EXTRACTION_INSTANCE_COLLECTION}/${instance.uid}`
      );
      await updateDoc(docRef, {
        status: newStatus,
      });

      setInstance({
        ...instance,
        status: newStatus,
      });

      addToast(`Instance ${newStatus}`, 'info');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-primary rounded-full p-2 bottom-0 mb-4 fixed z-50 flex text-white font-semibold">
      <div
        className="border-r-2 px-4 cursor-pointer"
        onClick={() => handleUpdateStatus('approved')}
      >
        <u>Approve</u>
      </div>
      <div
        className="px-4 cursor-pointer"
        onClick={() => handleUpdateStatus('rejected')}
      >
        <u>Reject</u>
      </div>
    </div>
  );
};
