import { useEffect, useState } from 'react';
import { ExtractionInstance, MondayTableValue } from '../../types/extraction';
import { Button } from '../UI/Button';
import { FormInput } from '../UI/FormInput';
import PDFViewer from '../UI/PDFViewer';
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

export const Payslip = ({ instance }: Props) => {
  const [formState, setFormState] = useState(instance.payslipRes ?? undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setInstance] = useRecoilState(extractionInstanceState);
  const addToast = useAddToast();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getFileDownloadUrl(instance.payslip.gcsUri);
      setImageUrl(url);
    };

    if (instance.payslip.mimeType !== 'application/pdf') {
      fetchImageUrl();
    }
  }, [instance.payslip]);

  if (!formState) {
    return;
  }

  const updateDeduction = (
    index: number,
    key: keyof MondayTableValue,
    value: string | number
  ) => {
    setFormState((prevState) => {
      if (!prevState) return;
      const updatedTableItems = [...prevState.deductions];
      updatedTableItems[index] = {
        ...updatedTableItems[index],
        [key]: value,
      };
      return {
        ...prevState,
        deductions: updatedTableItems,
      };
    });
  };

  const updateEarning = (
    index: number,
    key: keyof MondayTableValue,
    value: string | number
  ) => {
    setFormState((prevState) => {
      if (!prevState) return;
      const updatedTableItems = [...prevState.earnings];
      updatedTableItems[index] = {
        ...updatedTableItems[index],
        [key]: value,
      };
      return {
        ...prevState,
        earnings: updatedTableItems,
      };
    });
  };

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
        payslipRes: formState,
      });

      setInstance({
        ...instance,
        payslipRes: formState,
      });

      setLoading(false);
      addToast('Payslip updated!', 'info');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="pb-8 border-b-2">
      <h1 className="text-xl font-semibold">
        <u>Payslip</u>
      </h1>
      <div className="grid grid-cols-2 space-x-2 mt-8">
        <div className="pr-2 overflow-scroll">
          {instance.payslip.mimeType === 'application/pdf' && (
            <PDFViewer gcsUri={instance.payslip.gcsUri} />
          )}
          {instance.payslip.mimeType !== 'application/pdf' && (
            <img className="w-full h-auto" src={imageUrl} />
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="max-h-[80vh] overflow-y-scroll my-4">
              <div className="grid grid-cols-2 space-x-2 pl-2">
                <FormInput
                  id="netPay"
                  label="Net Pay"
                  type="number"
                  value={formState.netPay.amount}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      netPay: {
                        ...formState.netPay,
                        amount: parseFloat(value),
                      },
                    })
                  }
                />
                <FormInput
                  id="payDate"
                  label="Pay Date"
                  type="date"
                  value={formState.payDate.date}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      payDate: {
                        ...formState.payDate,
                        date: value,
                      },
                    })
                  }
                />
              </div>
              <p className="mb-4 font-bold text-gray-400 text-sm pl-2">
                <u>Deductions</u>
              </p>
              <div>
                {formState.deductions.map((item, i) => (
                  <div key={i} className="border-t-[1px] pt-4 pl-2">
                    <p className="text-xs mb-4 font-medium">
                      <u>{i + 1}.</u>
                    </p>
                    <div className="grid grid-cols-2 space-x-2">
                      <FormInput
                        id={`deduction-description-${i}`}
                        label="Description"
                        type="text"
                        value={item.description}
                        onChange={(value) =>
                          updateDeduction(i, 'description', value)
                        }
                      />
                      <FormInput
                        id={`deduction-amount-${i}`}
                        label="Amount"
                        type="number"
                        value={item.amount}
                        onChange={(value) =>
                          updateDeduction(i, 'amount', value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mb-4 font-bold text-gray-400 text-sm pl-2">
                <u>Earnings</u>
              </p>
              <div>
                {formState.earnings.map((item, i) => (
                  <div key={i} className="border-t-[1px] pt-4 pl-2">
                    <p className="text-xs mb-4 font-medium">
                      <u>{i + 1}.</u>
                    </p>
                    <div className="grid grid-cols-2 space-x-2">
                      <FormInput
                        id={`earning-description-${i}`}
                        label="Description"
                        type="text"
                        value={item.description}
                        onChange={(value) =>
                          updateEarning(i, 'description', value)
                        }
                      />
                      <FormInput
                        id={`earning-amount-${i}`}
                        label="Amount"
                        type="number"
                        value={item.amount}
                        onChange={(value) => updateEarning(i, 'amount', value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-2 pl-2">
              <Button
                text="Reset"
                onClick={() => setFormState(instance.payslipRes)}
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
