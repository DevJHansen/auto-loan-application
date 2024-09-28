import { useState } from 'react';
import { FileUpload } from '../UI/FileUpload';
import { convertFileToBase64 } from '../../utils/fileUtils';
import { FormInput } from '../UI/FormInput';
import { Button } from '../UI/Button';
import { classifyDoc } from '../../backend/functions';
import { getHighestConfidenceClassification } from '../../utils/extractUtils';
import { v4 as uuidv4 } from 'uuid';
import { uploadBase64File } from '../../backend/storage';
import { ExtractionInstance } from '../../types/extraction';
import { doc, setDoc } from 'firebase/firestore';
import { firestoreDB } from '../../backend/firestore';
import { EXTRACTION_INSTANCE_COLLECTION } from '../../constants/firebaseConstants';
import { useAddToast } from '../../hooks/toastHooks';

interface FileState {
  base64: string;
  mimeType: string;
  name: string;
}

interface FileChangeProps {
  file: File | null;
  field: string;
  setFileState: (file: FileState) => void;
  setErrorState: (msg: string) => void;
  setLoadingState: (state: boolean) => void;
}

export const NewInstance = () => {
  const [bankStatement, setBankStatement] = useState<FileState | null>(null);
  const [payslip, setPayslip] = useState<FileState | null>(null);
  const [idDoc, setIdDoc] = useState<FileState | null>(null);
  const [instanceName, setInstanceName] = useState('');
  const [bankStatementError, setBankStatementError] = useState('');
  const [payslipError, setPayslipError] = useState('');
  const [idDocError, setIdDocError] = useState('');
  const [bankStatementLoading, setBankStatementLoading] = useState(false);
  const [payslipLoading, setPayslipLoading] = useState(false);
  const [idDocLoading, setIdDocLoading] = useState(false);
  const [creatingInstance, setCreatingInstance] = useState(false);
  const [errCreatingInstance, setErrCreatingInstance] = useState('');
  const [instanceCreated, setInstanceCreated] = useState(false);
  const addToast = useAddToast();

  const handleFileChange = async ({
    file,
    field,
    setFileState,
    setErrorState,
    setLoadingState,
  }: FileChangeProps) => {
    if (!file) return;
    setErrorState('');
    setLoadingState(true);
    setInstanceCreated(false);

    const encodedFile = await convertFileToBase64(file);

    setFileState({
      base64: encodedFile,
      mimeType: file.type,
      name: file.name,
    });

    try {
      const classifyRes = await classifyDoc({
        documentBase64: encodedFile,
        mimeType: file.type,
      });

      const classification = getHighestConfidenceClassification(classifyRes);
      if (classification !== field) {
        if (field === 'bank_statement') {
          setErrorState('Invalid bank statement');
        }

        if (field === 'payslip') {
          setErrorState('Invalid payslip');
        }

        if (field === 'namibian_id') {
          setErrorState('Invalid ID document');
        }

        setLoadingState(false);
        return;
      }

      setLoadingState(false);
    } catch (error) {
      console.error(error);
      setErrorState('Error classifying document');
      setLoadingState(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creatingInstance || !bankStatement || !payslip || !idDoc) return;
    setCreatingInstance(true);
    setErrCreatingInstance('');

    try {
      const newInstanceId = uuidv4();
      const filePath = `extraction_instance/${newInstanceId}`;
      const [bankStatementRes, payslipRes, namibianIdRes] = await Promise.all([
        uploadBase64File(
          `${filePath}/bank_statement`,
          bankStatement.base64,
          bankStatement.mimeType,
          'bank_statement'
        ),
        uploadBase64File(
          `${filePath}/payslip`,
          payslip.base64,
          payslip.mimeType,
          'payslip'
        ),
        uploadBase64File(
          `${filePath}/namibian_id`,
          idDoc.base64,
          idDoc.mimeType,
          'namibian_id'
        ),
      ]);

      const newInstance: ExtractionInstance = {
        uid: newInstanceId,
        status: 'processing',
        name: instanceName,
        createdAt: +new Date(),
        warnings: [],
        bankStatement: {
          gcsUri: bankStatementRes.gcsUri,
          mimeType: bankStatement.mimeType,
          documentType: 'bank_statement',
        },
        payslip: {
          gcsUri: payslipRes.gcsUri,
          mimeType: payslip.mimeType,
          documentType: 'payslip',
        },
        namibianId: {
          gcsUri: namibianIdRes.gcsUri,
          mimeType: idDoc.mimeType,
          documentType: 'namibian_id',
        },
      };

      await setDoc(
        doc(firestoreDB, EXTRACTION_INSTANCE_COLLECTION, newInstanceId),
        newInstance
      );

      setCreatingInstance(false);
      setBankStatement(null);
      setPayslip(null);
      setIdDoc(null);
      setInstanceName('');

      setInstanceCreated(true);
      addToast('Documents are being processed', 'info');

      setTimeout(() => setInstanceCreated(false), 3000);
    } catch (error) {
      console.error(error);
      setCreatingInstance(false);
      setErrCreatingInstance('Error creating instance');
    }
  };

  const isFormValid =
    instanceName &&
    bankStatement &&
    !bankStatementError &&
    !bankStatementLoading &&
    payslip &&
    !payslipError &&
    !payslipLoading &&
    idDoc &&
    !idDocError &&
    !idDocLoading;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full">
        <section className="grid grid-cols-1gap-6 mt-8">
          <form onSubmit={handleSubmit}>
            <FormInput
              id="instanceName"
              label="Instance Name"
              value={instanceName}
              onChange={setInstanceName}
              required={true}
              placeholder="E.g. John Doe"
            />
            <FileUpload
              label={
                bankStatementLoading
                  ? 'Bank Statement (processing...)'
                  : 'Bank Statement'
              }
              id="bankStatement"
              className="mb-4"
              value={bankStatement?.name ?? ''}
              onFileChange={(file) =>
                handleFileChange({
                  file,
                  field: 'bank_statement',
                  setFileState: setBankStatement,
                  setErrorState: setBankStatementError,
                  setLoadingState: setBankStatementLoading,
                })
              }
              handleReset={() => {
                setBankStatement(null);
                setBankStatementError('');
              }}
              required={true}
              errorMsg={bankStatementError}
            />
            <FileUpload
              label={payslipLoading ? 'Payslip (processing...)' : 'Payslip'}
              id="payslip"
              className="mb-4"
              value={payslip?.name ?? ''}
              onFileChange={(file) =>
                handleFileChange({
                  file,
                  field: 'payslip',
                  setFileState: setPayslip,
                  setErrorState: setPayslipError,
                  setLoadingState: setPayslipLoading,
                })
              }
              handleReset={() => {
                setPayslip(null);
                setPayslipError('');
              }}
              required={true}
              errorMsg={payslipError}
            />
            <FileUpload
              label={
                idDocLoading ? 'ID Document (processing...)' : 'ID Document'
              }
              id="idDocument"
              value={idDoc?.name ?? ''}
              onFileChange={(file) =>
                handleFileChange({
                  file,
                  field: 'namibian_id',
                  setFileState: setIdDoc,
                  setErrorState: setIdDocError,
                  setLoadingState: setIdDocLoading,
                })
              }
              handleReset={() => {
                setIdDoc(null);
                setIdDocError('');
              }}
              required={true}
              errorMsg={idDocError}
            />
            <Button
              text="Submit"
              type="submit"
              className="mt-8 w-full"
              disabled={!isFormValid}
              loading={creatingInstance}
            />
          </form>
          <p className="text-center text-error py-4 font-semibold">
            {errCreatingInstance}
          </p>
          {instanceCreated ?? (
            <p className="text-center text-success py-4 font-semibold">
              New instance created!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
