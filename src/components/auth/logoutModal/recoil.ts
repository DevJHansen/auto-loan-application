import { atom } from 'recoil';

/**
 * @description Recoil state for logout modal
 */
export const logoutModal = atom<boolean>({
  key: 'logoutModal',
  default: false,
});
