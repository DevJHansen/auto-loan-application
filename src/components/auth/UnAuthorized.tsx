import { Link } from 'react-router-dom';

interface Props {
  link?: string;
}

export const UnAuthorized = ({ link = '/' }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-2xl mt-4">Unauthorized Access</p>
      <Link to={link}>
        <div className="mt-6 px-6 py-3 bg-primary text-white rounded-lg transition">
          Go Home
        </div>
      </Link>
    </div>
  );
};
