import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FaThLarge,
  FaTaxi,
  FaHistory,
  FaCreditCard,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function UserSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaThLarge /> },
    { name: 'Book a Ride', path: '/booking', icon: <FaTaxi /> },
    { name: 'My Rides', path: '/my-rides', icon: <FaHistory /> },
    { name: 'Payment History', path: '/payments', icon: <FaCreditCard /> },
    { name: 'My Profile', path: '/profile', icon: <FaUser /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
  ];

  return (
    <div className="bg-black text-white p-3 d-flex flex-column h-100 rounded-4 shadow-lg min-height-500">
      <div className="mb-4 text-center border-bottom border-secondary pb-3">
        <h5 className="text-yellow fw-bold mb-0">Passenger Portal</h5>
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
