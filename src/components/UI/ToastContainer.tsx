import { useRecoilState } from 'recoil';
import { ToastNotification } from './ToastNotification';
import { toastState } from '../../hooks/toastHooks';

export const ToastContainer = () => {
  const [toasts, setToasts] = useRecoilState(toastState);

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-4">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};
