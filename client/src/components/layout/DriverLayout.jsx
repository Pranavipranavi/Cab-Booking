import { Outlet } from 'react-router-dom';
import DriverSidebar from './DriverSidebar.jsx';

export default function DriverLayout() {
  return (
    <div className="row g-4">
      {/* Driver Sidebar Column */}
      <div className="col-lg-3 d-none d-lg-block">
        <DriverSidebar />
      </div>

      {/* Driver Sub-view Content Column */}
      <div className="col-lg-9 col-12">
        <div className="bg-white p-4 rounded-4 shadow-sm min-height-500 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
