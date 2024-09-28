import { v4 as uuidv4 } from 'uuid';
import { useSetRecoilState } from 'recoil';

import { atom } from 'recoil';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const toastState = atom<Toast[]>({
  key: 'toastState',
  default: [],
});

export const useAddToast = () => {
  const setToasts = useSetRecoilState(toastState);

  return (message: string, type: 'success' | 'error' | 'info') => {
    const newToast = { id: uuidv4(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };
};
