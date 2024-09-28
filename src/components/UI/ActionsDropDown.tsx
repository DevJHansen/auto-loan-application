import { MdOutlineMoreVert } from 'react-icons/md';
import { useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/outsideClick';

type Position = 'top' | 'bottom';

interface DropdownOption {
  label: string;
  handler: () => void;
  icon?: JSX.Element;
}

interface DropdownProps {
  options: DropdownOption[];
  position?: Position;
}

export const ActionsDropdown = ({
  options,
  position = 'bottom',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  return (
    <div className="relative flex justify-center w-[50px]">
      <MdOutlineMoreVert
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        size={42}
        className={`clickable-icon ${isOpen && 'text-accent bg-background'}`}
      />
      {isOpen && (
        <div
          className={`absolute right-2 md:right-auto bg-white border rounded shadow-lg ${
            position === 'bottom' ? 'mt-16' : '-top-[200px]'
          } z-50`}
          ref={ref}
        >
          {position === 'bottom' && (
            <div className="w-full flex justify-center">
              <div className="w-6 h-6 rotate-45 bg-white relative -top-[13px] border-t border-l" />
            </div>
          )}
          <div ref={dropdownRef}>
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => {
                  option.handler();
                  setIsOpen(false);
                }}
              >
                {option.label}
                {option.icon && <div className="ml-2">{option.icon}</div>}
              </div>
            ))}
          </div>
          {position === 'top' && (
            <div className="w-full flex justify-center">
              <div className="w-6 h-6 rotate-45 bg-white relative -bottom-[13px] border-b border-r" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
