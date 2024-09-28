import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotFound } from './components/UI/NotFound';
import { ResetPasswordSuccess } from './components/auth/resetPassword/ResetPasswordSuccess';
import { ResetPassword } from './components/auth/resetPassword/ResetPassword';
import { ForgotPassword } from './components/auth/forgotPassword/ForgotPassword';
import { Login } from './components/auth/login/Login';
import { ProtectedRoute } from './components/auth/protectedRoutes/ProtectedRoute';
import { Home } from './components/home/Home';
import { Instance } from './components/instance/Instnace';
import { ToastContainer } from './components/UI/ToastContainer';

const ProtectedHome = ProtectedRoute(Home);
const ProtectedInstance = ProtectedRoute(Instance);

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedHome />} />
          <Route path="/:id" element={<ProtectedInstance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password-success"
            element={<ResetPasswordSuccess />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
