import type { ReactNode } from 'react';
import { useOutsideClick } from '../../hooks/outsideClick';
import { MdClear } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const ref = useOutsideClick<HTMLDivElement>(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-background rounded-lg overflow-hidden shadow-xl transform transition-all md:max-w-xl sm:w-full m-2"
        ref={ref}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <MdClear
              className="text-primary cursor-pointer"
              onClick={onClose}
              size={22}
            />
          </div>
          <div className="p-4">
            <h2 className="text-primary text-2xl mb-4">{title}</h2>
            <div className="mt-4 text-white">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
