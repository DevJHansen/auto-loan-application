import { useState } from 'react';
import { MdWarning, MdExpandMore, MdExpandLess } from 'react-icons/md';

interface Props {
  warnings: string[];
  className?: string;
}

export const Warnings = ({ warnings, className = '' }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`border border-warning rounded-md p-4 w-full ${className}`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <MdWarning className="text-orange-500 mr-2" size={24} />
          <span className="font-semibold text-gray-400">
            {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
          </span>
        </div>
        <div>
          {expanded ? (
            <MdExpandLess className="text-gray-400" size={24} />
          ) : (
            <MdExpandMore className="text-gray-400" size={24} />
          )}
        </div>
      </div>

      {expanded && (
        <ul className="mt-3 space-y-2 list-disc list-inside">
          {warnings.map((warning, index) => (
            <li key={index} className=" text-orange-500 p-2 rounded-md">
              {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
