import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';
import UserSidebar from './UserSidebar.jsx';

export default function PrivateLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader fullPage message="Loading passenger session..." />;
  }

  // Redirect to login if token is missing
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="row g-4">
      {/* Sidebar Column */}
      <div className="col-lg-3 d-none d-lg-block">
        <UserSidebar />
      </div>

      {/* Sub-view Content Column */}
      <div className="col-lg-9 col-12">
        <div className="bg-white p-4 rounded-4 shadow-sm min-height-500 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
