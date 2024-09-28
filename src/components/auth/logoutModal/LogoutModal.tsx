import { useRecoilState } from 'recoil';
import { logoutModal } from './recoil';
import { Modal } from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { auth } from '../../../backend/firebase';

export const LogoutModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(logoutModal);
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Logout">
        <div>
          <p>Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => setIsOpen(false)}
              text="Cancel"
              outline={true}
            />
            <Button onClick={handleLogout} text="Logout" />
          </div>
        </div>
      </Modal>
    </>
  );
};
