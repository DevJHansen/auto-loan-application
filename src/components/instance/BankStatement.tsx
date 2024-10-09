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
import { MdAdd, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';

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
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

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

  const handleAddTableItem = () =>
    setFormState({
      ...formState,
      tableItems: [
        {
          description: '',
          date: '',
          income: 0,
          expense: 0,
        },
        ...formState.tableItems,
      ],
    });

  const handleRemoveTableItem = (index: number) => {
    setFormState({
      ...formState,
      tableItems: formState.tableItems.filter((_, i) => i !== index),
    });
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
              <div className="grid grid-cols-2 space-x-2 pl-2">
                <FormInput
                  id="totalIncome"
                  label="Total Income"
                  type="number"
                  value={formState.totalIncome}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      totalIncome: parseFloat(value),
                    })
                  }
                />
                <FormInput
                  id="totalExpenses"
                  label="Total Expenses"
                  type="number"
                  value={formState.totalExpenses}
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      totalExpenses: parseFloat(value),
                    })
                  }
                />
              </div>
              <div className="my-4 flex items-center">
                <p className="text-gray-400 font-bold text-md pl-2 mr-2">
                  <u>Table Items</u>
                </p>
                <MdAdd
                  size={16}
                  className="text-white border-[1px] border-white rounded hover:bg-primary hover:border-primary cursor-pointer"
                  onClick={handleAddTableItem}
                />
              </div>
              <div
                className="cursor-pointer text-white"
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <MdExpandMore size={24} className="mb-2" />
                ) : (
                  <MdExpandLess size={24} className="mb-2" />
                )}
              </div>
              {!isCollapsed && (
                <div>
                  {formState.tableItems.map((item, i) => (
                    <div key={i} className="border-t-[1px] pt-4 pl-2">
                      <div className="mb-4 flex items-center">
                        <p className="text-xs text-gray-400 font-medium mr-2">
                          <u>{i + 1}.</u>
                        </p>
                        <MdDelete
                          size={16}
                          className="text-white border-[1px] border-white rounded hover:bg-primary hover:border-primary cursor-pointer"
                          onClick={() => handleRemoveTableItem(i)}
                        />
                      </div>
                      <div className="grid grid-cols-2 space-x-2">
                        <FormInput
                          id={`date-${i}`}
                          label="Date"
                          type="date"
                          value={item.date}
                          onChange={(value) =>
                            updateTableItem(i, 'date', value)
                          }
                        />
                        <FormInput
                          id={`description-${i}`}
                          label="Description"
                          type="text"
                          value={item.description}
                          onChange={(value) =>
                            updateTableItem(i, 'description', value)
                          }
                          placeholder="E.g. Salary"
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
              )}
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
