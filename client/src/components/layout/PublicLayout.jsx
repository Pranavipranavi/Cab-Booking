import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

export default function PublicLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader fullPage message="Authenticating session..." />;
  }

  // Redirect to user dashboard if already logged in
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
