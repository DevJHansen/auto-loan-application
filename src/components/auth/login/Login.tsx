import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../backend/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../../UI/Button';
import { FormInput } from '../../UI/FormInput';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      setError('Email or password is incorrect');
      console.error(error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen  text-white"
      data-testid="login-form"
    >
      <div className="flex flex-col items-center justify-center lg:min-w-[50%]">
        <h1 className="font-bold text-[36px] text-center text-primary">
          Login
        </h1>
        <form className="w-[100%] mt-8" onSubmit={signIn}>
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            id="email"
            required
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="********"
            id="password"
            required
            value={password}
            onChange={(value) => setPassword(value)}
            minLength={6}
          />
          <Button
            text="Login"
            loading={loading}
            type="submit"
            className="w-full mt-8"
          />
          <Link to="/forgot-password">
            <p className="text-sm text-accent mt-4 text-center">
              <u>Forgot password?</u>
            </p>
          </Link>
          {error && (
            <p className="text-sm font-semibold text-center mt-4 text-error">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
