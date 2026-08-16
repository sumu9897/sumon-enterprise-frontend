import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage text="Verifying your session…" />;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
};

export default PrivateRoute;
