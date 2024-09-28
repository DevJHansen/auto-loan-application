import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getFileDownloadUrl } from '../../backend/storageUtils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { LoadingSpinner } from './LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface Props {
  gcsUri: string;
}

const PDFViewer = ({ gcsUri }: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getFileDownloadUrl(gcsUri);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    fetchPdfUrl();
  }, [gcsUri]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      {pdfUrl ? (
        <div>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex justify-center mt-8">
                <LoadingSpinner className="border-accent" />
              </div>
            }
            className="bg-black"
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <div>
            {numPages > 1 && (
              <div className="mt-6 px-2 flex">
                {pageNumber > 1 && (
                  <MdArrowLeft
                    onClick={() => setPageNumber(pageNumber - 1)}
                    size={24}
                    className="mr-2 border-[1px] border-black rounded-full cursor-pointer"
                  />
                )}
                {pageNumber < numPages && (
                  <MdArrowRight
                    onClick={() => setPageNumber(pageNumber + 1)}
                    size={24}
                    className="border-[1px] border-black rounded-full cursor-pointer"
                  />
                )}
                <p className="ml-2">
                  Page {pageNumber} of {numPages}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <LoadingSpinner className="border-accent" />
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
