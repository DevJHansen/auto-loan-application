import { useRecoilState } from 'recoil';
import { extractionInstanceState } from './recoil';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../../backend/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../../constants/firebaseConstants';
import { ExtractionInstance } from '../../types/extraction';
import { PageHeading } from '../UI/PageHeading';
import { BankStatement } from './BankStatement';
import { Warnings } from './Warnings';
import { Payslip } from './Payslip';
import { NamibianId } from './NamibianId';
import { Toolbar } from './Toolbar';

export const Instance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instance, setInstance] = useRecoilState(extractionInstanceState);

  useEffect(() => {
    const getInstance = async () => {
      if (!id || instance) {
        return;
      }

      const docRef = doc(
        firestoreDB,
        `${EXTRACTION_INSTANCE_COLLECTION}/${id}`
      );
      const docRes = await getDoc(docRef);

      if (!docRes.exists()) {
        return;
      }

      setInstance(docRes.data() as ExtractionInstance);
    };

    getInstance();
  }, [id, instance, setInstance]);

  if (!instance || !id) {
    return;
  }

  return (
    <>
      <div className="sidebar-spacing py-8 min-h-screen">
        <main className="flex-1 p-6 overflow-auto">
          <PageHeading
            title={instance.name}
            description={`Status: ${instance.status}`}
            backIconClick={() => {
              navigate('/');
              setInstance(null);
            }}
          />
        </main>
        <div className="p-4">
          <Warnings warnings={instance.warnings} className="mb-8" />
          <BankStatement instance={instance} />
          <div className="mt-8" />
          <Payslip instance={instance} />
          <div className="mt-8" />
          <NamibianId instance={instance} />
        </div>
        <div className="flex w-full justify-center">
          <Toolbar />
        </div>
      </div>
    </>
  );
};
