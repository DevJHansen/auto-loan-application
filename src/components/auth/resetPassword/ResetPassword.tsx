import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../UI/Button';
import { FormInput } from '../../UI/FormInput';
import { auth } from '../../../backend/firebase';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const actionCode = searchParams.get('oobCode');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const checkCode = async () => {
      if (!actionCode) {
        navigate('/login');
        return;
      }

      try {
        const userEmail = await verifyPasswordResetCode(auth, actionCode);
        if (!userEmail) {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error(error);
        navigate('/login');
        return;
      }
    };

    checkCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (!actionCode) return;
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      setError('Confirm Password does not match New Password.');
      setLoading(false);
      return;
    }

    confirmPasswordReset(auth, actionCode, password)
      .then(() => {
        setLoading(false);
        navigate('/reset-password-success');
      })
      .catch((error: unknown) => {
        setLoading(false);
        console.error(error);
        setError('Error resetting password');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-16 rounded-2xl lg:min-w-[50%]">
        <h1 className="font-bold text-[36px] text-center text-primary">
          Reset Password
        </h1>
        <form className="w-[100%] mt-8" onSubmit={resetPassword}>
          <FormInput
            type="password"
            id="newPassword"
            value={password}
            onChange={(value) => setPassword(value)}
            label={'New Password'}
            required={true}
            placeholder="********"
            minLength={6}
            showStrength={true}
          />
          <FormInput
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            label={'Confirm Password'}
            required={true}
            placeholder="********"
          />
          <Button
            text="Reset"
            loading={loading}
            type="submit"
            className="w-full mt-8"
          />
          <Link to="/login">
            <p className="text-sm text-accent mt-4 text-center">
              <u>Go to login</u>
            </p>
          </Link>
        </form>
        {error && (
          <p className="text-sm font-semibold text-center mt-4 text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
