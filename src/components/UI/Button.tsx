import { LoadingSpinner } from './LoadingSpinner';

export type ButtonSeverity = 'danger' | 'success' | 'warning' | 'info';

interface Props {
  onClick?: () => void;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  outline?: boolean;
  children?: React.ReactNode;
  preventDefault?: boolean;
  severity?: ButtonSeverity;
}

const BACKGROUND_COLOURS = {
  danger: 'bg-error border-2 border-error',
  success: 'bg-success border-2 border-success',
  warning: 'bg-warning border-2 border-warning',
  info: 'bg-primary border-2 border-info',
};

export const Button = ({
  onClick,
  text,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  outline = false,
  children,
  preventDefault = false,
  severity,
}: Props) => {
  return (
    <button
      className={`${outline ? 'button-outline' : 'button'} ${
        severity && BACKGROUND_COLOURS[severity]
      } ${className} ${loading && 'opacity-50'} ${
        disabled && 'bg-background  border-2 border-background'
      }`}
      onClick={() => {
        if (loading) return;
        if (disabled) return;
        if (preventDefault) return;
        if (!onClick) return;
        onClick();
      }}
      disabled={disabled}
      type={type}
    >
      {text} {children} {loading && <LoadingSpinner className="ml-2" />}
    </button>
  );
};
