import { useNavigate } from 'react-router-dom';
import { Button } from '../../UI/Button';

export const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white">
      <div className="flex flex-col items-center justify-center bg-primary p-16 rounded-2xl lg:min-w-[50%]">
        <h1 className="font-bold text-[36px] text-center text-white">
          Success!
        </h1>
        <p className="text-center mt-4">
          Your password has been successfully reset. Please login with your new
          password.
        </p>
        <Button
          text="Go to login"
          onClick={() => {
            navigate('/login');
          }}
          className="w-full bg-accent mt-8"
        />
      </div>
    </div>
  );
};
