import { useEffect } from 'react';
import { TOAST_TIMEOUT_DURATION } from '../../constants/timeout';
import { Toast } from '../../hooks/toastHooks';

interface Props {
  toast: Toast;
  onRemove: (id: string) => void;
}

const getBgColor = (type: Toast['type']) => {
  if (type === 'success') return 'bg-success';
  if (type === 'error') return 'bg-error';
  return 'bg-primary';
};

export const ToastNotification = ({ toast, onRemove }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), TOAST_TIMEOUT_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const bgColor = getBgColor(toast.type);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${bgColor} text-white`}
    >
      {toast.message}
    </div>
  );
};
