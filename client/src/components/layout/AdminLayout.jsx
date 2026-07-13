import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

export default function AdminLayout() {
  return (
    <div className="row g-4">
      {/* Admin Sidebar Column */}
      <div className="col-lg-3 d-none d-lg-block">
        <AdminSidebar />
      </div>

      {/* Admin Sub-view Content Column */}
      <div className="col-lg-9 col-12">
        <div className="bg-white p-4 rounded-4 shadow-sm min-height-500 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
