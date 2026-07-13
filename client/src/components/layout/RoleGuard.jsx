import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

export default function RoleGuard({ allowedRoles }) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <Loader fullPage message="Verifying credentials..." />;
  }

  // Redirect to login if token is missing
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if role is mismatched
    if (user.role === 'driver') {
      return <Navigate to="/driver/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
