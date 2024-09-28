import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <Link to="/">
        <div className="mt-6 px-6 py-3 bg-primary text-white rounded-lg transition">
          Go Home
        </div>
      </Link>
    </div>
  );
};
