import { MdClose } from 'react-icons/md';

interface Props {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
  classes?: string;
  handleClick?: () => void;
}

export const Label = ({ text, type, classes = '', handleClick }: Props) => {
  const color = {
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-accent',
  };

  return (
    <span
      className={`flex items-center text-xs text-white px-2 py-[4px] rounded ${color[type]} ${classes}`}
      onClick={handleClick}
    >
      {text}
      {handleClick !== undefined && <MdClose className="ml-2 cursor-pointer" />}
    </span>
  );
};
