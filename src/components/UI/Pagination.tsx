import { useState, useEffect } from 'react';

const MAX_PAGE_BUTTONS = 5;
const MIN_PAGE_BUTTONS = 2;
const SIDE_PAGES = 2;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const [pageButtons, setPageButtons] = useState<number[]>([]);

  useEffect(() => {
    let length = MAX_PAGE_BUTTONS;
    let start = 1;

    if (totalPages < MAX_PAGE_BUTTONS) {
      length = totalPages;
    } else if (currentPage > SIDE_PAGES) {
      start = currentPage - SIDE_PAGES;
    }

    if (length + start > totalPages) {
      start = totalPages - length;
    }

    if (start < 1) {
      start = 1;
    }
    const rangeOfPageButtons = Array.from(
      { length },
      (_, index) => index + start
    );

    setPageButtons(rangeOfPageButtons);
  }, [currentPage, totalPages]);

  if (totalPages < MIN_PAGE_BUTTONS) return;

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    handlePageClick(currentPage - 1);
  };

  const handleNext = () => {
    handlePageClick(currentPage + 1);
  };

  const handleStart = () => {
    handlePageClick(1);
  };

  const handleEnd = () => {
    handlePageClick(totalPages);
  };

  return (
    <nav aria-label="Pagination" className="w-full flex flex-col items-center">
      <ul className="inline-flex items-center mx-auto py-4">
        <li
          className={`pagination-button ${
            currentPage === 1 && 'pagination-button-hidden'
          }`}
          onClick={handleStart}
        >
          <a aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          className={`pagination-button ${
            currentPage === 1 && 'pagination-button-hidden'
          }`}
          onClick={handlePrevious}
        >
          <a aria-label="Previous">
            <span aria-hidden="true">&lsaquo;</span>
          </a>
        </li>
        {pageButtons.map((page) => (
          <li
            key={page}
            className={`cursor-pointer rounded px-3 py-2 mx-1 leading-tight text-gray-400 drop-shadow-md ${
              page === currentPage && 'bg-primary text-white'
            }`}
            onClick={() => {
              if (page === currentPage) return;
              handlePageClick(page);
            }}
          >
            <a>{page}</a>
          </li>
        ))}
        <li
          className={`pagination-button ${
            currentPage === totalPages && 'pagination-button-hidden'
          }`}
          onClick={handleNext}
        >
          <a aria-label="Next">
            <span aria-hidden="true">&rsaquo;</span>
          </a>
        </li>
        <li
          className={`pagination-button ${
            currentPage === totalPages && 'pagination-button-hidden'
          }`}
          onClick={handleEnd}
        >
          <a aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
