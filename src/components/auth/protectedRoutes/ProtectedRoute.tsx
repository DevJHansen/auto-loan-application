import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../backend/firebase';
import { Loading } from '../../UI/Loading';
import { Sidebar } from '../../UI/Sidebar';
import { LogoutModal } from '../logoutModal/LogoutModal';

export const ProtectedRoute = (Component: React.ComponentType) => {
  const AuthProtectedComponent: React.FC = (props) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
      return (
        <div className="w-screen h-screen flex justify-center items-center">
          <Loading />
        </div>
      );
    }

    if (error) {
      return <div>{`Error: ${error}`}</div>;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return (
      <div>
        <LogoutModal />
        <Sidebar />
        <Component {...props} />
      </div>
    );
  };

  return AuthProtectedComponent;
};
