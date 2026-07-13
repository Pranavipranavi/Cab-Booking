import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FaThLarge,
  FaUsers,
  FaCarSide,
  FaCar,
  FaRoute,
  FaCreditCard,
  FaGift,
  FaStar,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaThLarge /> },
    { name: 'Passengers', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Drivers', path: '/admin/drivers', icon: <FaCarSide /> },
    { name: 'Vehicles', path: '/admin/vehicles', icon: <FaCar /> },
    { name: 'Bookings', path: '/admin/rides', icon: <FaRoute /> },
    { name: 'Payments', path: '/admin/payments', icon: <FaCreditCard /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <FaGift /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaStar /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <div className="bg-black text-white p-3 d-flex flex-column h-100 rounded-4 shadow-lg min-height-500">
      <div className="mb-4 text-center border-bottom border-secondary pb-3">
        <h5 className="text-yellow fw-bold mb-0">Admin Panel</h5>
      </div>

      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {menuItems.map((item, idx) => (
          <li key={idx} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 text-white ${
                  isActive ? 'bg-warning text-black font-weight-bold shadow' : 'hover-bg-dark-gray'
                }`
              }
            >
              <span className="fs-5">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-top border-secondary pt-3 mt-4">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2.5"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
