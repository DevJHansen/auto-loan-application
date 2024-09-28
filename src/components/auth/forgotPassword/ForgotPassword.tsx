import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { FormInput } from '../../UI/FormInput';
import { Link } from 'react-router-dom';
import { Button } from '../../UI/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (value: string) => {
    setEmail(value);
  };

  const sendResetEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailHasBeenSent(true);
        setLoading(false);
        setEmail('');
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setError('Error resetting password');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center justify-center p-16 rounded-2xl lg:min-w-[50%]">
        <h1 className="font-bold text-[36px] text-center text-primary">
          Reset Your Password
        </h1>
        <form className="w-[100%] mt-8" onSubmit={sendResetEmail}>
          <FormInput
            type="email"
            id="userEmail"
            value={email}
            placeholder="Email"
            onChange={(value) => onChangeHandler(value)}
            label={'Email'}
            required={true}
          />
          <Button
            text="Reset"
            loading={loading}
            type="submit"
            className="w-full mt-8"
          />
          <Link to="/login">
            <p className="text-sm text-accent mt-4 text-center">
              <u>Back to login</u>
            </p>
          </Link>
          {error && (
            <p className="text-sm font-semibold text-error text-center mt-4">
              {error}
            </p>
          )}
          {emailHasBeenSent && (
            <p className="text-sm font-semibold text-center mt-4 text-success">
              An email has been sent to you!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
