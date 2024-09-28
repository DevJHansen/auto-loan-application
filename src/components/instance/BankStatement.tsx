import { useEffect, useState } from 'react';
import { ExtractionInstance, TableItem } from '../../types/extraction';
import { FormInput } from '../UI/FormInput';
import PDFViewer from '../UI/PDFViewer';
import { Button } from '../UI/Button';
import { getFileDownloadUrl } from '../../backend/storageUtils';
import { doc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../../backend/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../../constants/firebaseConstants';
import { useRecoilState } from 'recoil';
import { extractionInstanceState } from './recoil';
import { useAddToast } from '../../hooks/toastHooks';

interface Props {
  instance: ExtractionInstance;
}

export const BankStatement = ({ instance }: Props) => {
  const [formState, setFormState] = useState(
    instance.bankStatementRes ?? undefined
  );
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setInstance] = useRecoilState(extractionInstanceState);
  const addToast = useAddToast();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getFileDownloadUrl(instance.bankStatement.gcsUri);
      setImageUrl(url);
    };

    if (instance.bankStatement.mimeType !== 'application/pdf') {
      fetchImageUrl();
    }
  }, [instance.bankStatement]);

  if (!formState) {
    return;
  }

  const updateTableItem = (
    index: number,
    key: keyof TableItem,
    value: string | number
  ) => {
    setFormState((prevState) => {
      if (!prevState) return;
      const updatedTableItems = [...prevState.tableItems];
      updatedTableItems[index] = {
        ...updatedTableItems[index],
        [key]: value,
      };
      return {
        ...prevState,
        tableItems: updatedTableItems,
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
        bankStatementRes: formState,
      });

      setInstance({
        ...instance,
        bankStatementRes: formState,
      });

      setLoading(false);
      addToast('Bank statement updated!', 'info');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="pb-8 border-b-2">
      <h1 className="text-xl font-semibold">
        <u>Bank Statement</u>
      </h1>
      <div className="grid grid-cols-2 space-x-2 mt-8">
        <div className="pr-2 overflow-scroll">
          {instance.bankStatement.mimeType === 'application/pdf' && (
            <PDFViewer gcsUri={instance.bankStatement.gcsUri} />
          )}
          {instance.bankStatement.mimeType !== 'application/pdf' && (
            <img className="w-full h-auto" src={imageUrl} />
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="max-h-[80vh] overflow-y-scroll my-4">
              <div className="grid grid-cols-2 space-x-2 pl-2">
                <FormInput
                  id="startDate"
                  label="Statement Start Date"
                  type="date"
                  value={formState.statementStartDate.date}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      statementStartDate: {
                        ...formState.statementStartDate,
                        date: value,
                      },
                    })
                  }
                />
                <FormInput
                  id="endDate"
                  label="Statement End Date"
                  type="date"
                  value={formState.statementEndDate.date}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      statementEndDate: {
                        ...formState.statementEndDate,
                        date: value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 space-x-2 pl-2">
                <FormInput
                  id="openingBalance"
                  label="Opening Balance"
                  type="number"
                  value={formState.openingBalance.amount}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      openingBalance: {
                        ...formState.openingBalance,
                        amount: parseFloat(value),
                      },
                    })
                  }
                />
                <FormInput
                  id="closingBalance"
                  label="Closing Balance"
                  type="number"
                  value={formState.closingBalance.amount}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      closingBalance: {
                        ...formState.closingBalance,
                        amount: parseFloat(value),
                      },
                    })
                  }
                />
              </div>
              <p className="mb-4 text-gray-400 font-bold text-sm pl-2">
                <u>Table Items</u>
              </p>
              <div>
                {formState.tableItems.map((item, i) => (
                  <div key={i} className="border-t-[1px] pt-4 pl-2">
                    <p className="text-xs mb-4 text-gray-400 font-medium">
                      <u>{i + 1}.</u>
                    </p>
                    <div className="grid grid-cols-2 space-x-2">
                      <FormInput
                        id={`date-${i}`}
                        label="Date"
                        type="date"
                        value={item.date}
                        onChange={(value) => updateTableItem(i, 'date', value)}
                      />
                      <FormInput
                        id={`description-${i}`}
                        label="Description"
                        type="text"
                        value={item.description}
                        onChange={(value) =>
                          updateTableItem(i, 'description', value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 space-x-2">
                      <FormInput
                        id={`income-${i}`}
                        label="Income"
                        type="number"
                        value={item.income}
                        onChange={(value) =>
                          updateTableItem(i, 'income', value)
                        }
                      />
                      <FormInput
                        id={`expense-${i}`}
                        label="Expense"
                        type="number"
                        value={item.expense}
                        onChange={(value) =>
                          updateTableItem(i, 'expense', value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-2 pl-2">
              <Button
                text="Reset"
                onClick={() => setFormState(instance.bankStatementRes)}
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
