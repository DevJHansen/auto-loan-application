import { useEffect, useRef, useState } from 'react';
import { FormFieldLabel } from './FormFieldLabel';
import { MdDescription, MdCancel, MdFileDownload } from 'react-icons/md';

interface Props {
  label: string;
  id: string;
  className?: string;
  value: string;
  onFileChange: (file: File | null) => void;
  handleReset: () => void;
  errorMsg?: string;
  instructions?: string;
  required?: boolean;
}

export const FileUpload = ({
  label,
  id,
  className = '',
  value,
  onFileChange,
  handleReset,
  errorMsg = '',
  instructions = '',
  required = false,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(value);

  useEffect(() => {
    if (value !== '') {
      setFileName(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value === '') {
      setFileName(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ? event.target.files[0] : null;
    setFileName(file?.name ?? null);
    onFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const { files } = event.dataTransfer;
    if (files.length) {
      const file = files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const resetFileInput = () => {
    setFileName(null);
    handleReset();
  };
  return (
    <div className={`${className}`}>
      <FormFieldLabel label={label} id={id} required={required} />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex justify-center items-center border-2 border-dotted border-accent p-3 rounded-md bg-background ${
          errorMsg && 'border-error'
        }`}
      >
        <div
          className={`p-3 ${
            errorMsg ? 'text-error' : 'text-accent'
          } rounded-md cursor-pointer flex items-center justify-center`}
        >
          {fileName ? (
            <>
              <p>{fileName}</p>
              <MdDescription className="mx-4 text-xl" />
              <MdCancel className="text-lg" onClick={() => resetFileInput()} />
            </>
          ) : (
            <>
              {isDragging ? (
                <>
                  <p>Drop your file here</p>
                  <MdFileDownload className="ml-4 text-2xl" />
                </>
              ) : (
                <>
                  <p>Drop files to upload or </p>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-accent px-4 py-2 ${
                      errorMsg ? 'text-error' : 'text-accent'
                    } rounded-md flex items-center justify-center ml-4`}
                  >
                    Browse
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*, application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple={false}
          required={required}
        />
      </div>
      <p className="text-accent opacity-60 mt-2 text-xs font-bold">
        {instructions}
      </p>
      <p className={`text-error mt-2 text-xs ${errorMsg ? 'error' : 'hidden'}`}>
        {errorMsg}
      </p>
    </div>
  );
};
