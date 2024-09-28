import { useEffect, useState } from 'react';
import { ExtractionInstance } from '../../types/extraction';
import PDFViewer from '../UI/PDFViewer';
import { Button } from '../UI/Button';
import { FormInput } from '../UI/FormInput';
import { getFileDownloadUrl } from '../../backend/storageUtils';
import { useRecoilState } from 'recoil';
import { extractionInstanceState } from './recoil';
import { doc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../../backend/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../../constants/firebaseConstants';
import { useAddToast } from '../../hooks/toastHooks';

interface Props {
  instance: ExtractionInstance;
}

export const NamibianId = ({ instance }: Props) => {
  const [formState, setFormState] = useState(
    instance.namibianIdRes ?? undefined
  );
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setInstance] = useRecoilState(extractionInstanceState);
  const addToast = useAddToast();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getFileDownloadUrl(instance.namibianId.gcsUri);
      setImageUrl(url);
    };

    if (instance.namibianId.mimeType !== 'application/pdf') {
      fetchImageUrl();
    }
  }, [instance.namibianId]);

  if (!formState) {
    return;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(
        firestoreDB,
        `${EXTRACTION_INSTANCE_COLLECTION}/${instance.uid}`
      );
      await updateDoc(docRef, {
        namibianIdRes: formState,
      });

      setInstance({
        ...instance,
        namibianIdRes: formState,
      });

      setLoading(false);
      addToast('ID updated!', 'info');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="pb-8 border-b-2">
      <h1 className="text-xl font-semibold">
        <u>Namibian ID</u>
      </h1>
      <div className="grid grid-cols-2 space-x-2 mt-8">
        <div className="pr-2 overflow-scroll">
          {instance.namibianId.mimeType === 'application/pdf' && (
            <PDFViewer gcsUri={instance.namibianId.gcsUri} />
          )}
          {instance.namibianId.mimeType !== 'application/pdf' && (
            <img className="w-full h-auto" src={imageUrl} />
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="max-h-[80vh] overflow-y-scroll my-4">
              <div className="grid grid-cols-1 pl-2">
                <FormInput
                  id="first-name"
                  label="First Name"
                  type="text"
                  value={formState.firstName.text}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      firstName: {
                        ...formState.firstName,
                        text: value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 pl-2">
                <FormInput
                  id="surname"
                  label="Surname"
                  type="text"
                  value={formState.surname.text}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      surname: {
                        ...formState.surname,
                        text: value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 pl-2">
                <FormInput
                  id="idNumber"
                  label="ID Number"
                  type="text"
                  value={formState.idNumber.text}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      idNumber: {
                        ...formState.idNumber,
                        text: value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 pl-2">
                <FormInput
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  value={formState.dob}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      dob: value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-2 pl-2">
              <Button
                text="Reset"
                onClick={() => setFormState(instance.namibianIdRes)}
                outline={true}
              />
              <Button text="Save" type="submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
