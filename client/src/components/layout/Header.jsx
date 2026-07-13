import { Link, NavLink } from 'react-router-dom';
import {
  FaTaxi,
  FaUserCircle,
  FaCreditCard,
  FaHistory,
  FaThLarge,
  FaSignOutAlt,
  FaCar,
  FaWallet,
  FaUsers,
  FaCarSide,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
  const { token, user, logout } = useAuth();

  const getDashboardRedirect = () => {
    if (!user) return '/';
    if (user.role === 'driver') return '/driver/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-ucab">
      <div className="container">
        <Link
          className="navbar-brand navbar-brand-ucab d-flex align-items-center"
          to={getDashboardRedirect()}
        >
          <FaTaxi className="me-2 text-yellow" />
          <span>
            U<span className="text-white">Cab</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!token ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                  }
                  to="/"
                >
                  Home
                </NavLink>
              </li>
            ) : (
              <>
                {/* 1. Passenger Nav Items */}
                {user?.role === 'user' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/dashboard"
                      >
                        <FaThLarge className="me-1" /> Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/booking"
                      >
                        <FaTaxi className="me-1" /> Book Ride
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/my-rides"
                      >
                        <FaHistory className="me-1" /> My Trips
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/payments"
                      >
                        <FaCreditCard className="me-1" /> Payments
                      </NavLink>
                    </li>
                  </>
                )}

                {/* 2. Driver Nav Items */}
                {user?.role === 'driver' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/driver/dashboard"
                      >
                        <FaThLarge className="me-1" /> Driver Console
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/driver/vehicle"
                      >
                        <FaCar className="me-1" /> Vehicle
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/driver/history"
                      >
                        <FaHistory className="me-1" /> Jobs History
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/driver/earnings"
                      >
                        <FaWallet className="me-1" /> Earnings
                      </NavLink>
                    </li>
                  </>
                )}

                {/* 3. Admin Nav Items */}
                {user?.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/admin/dashboard"
                      >
                        <FaThLarge className="me-1" /> Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/admin/users"
                      >
                        <FaUsers className="me-1" /> Passengers
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/admin/drivers"
                      >
                        <FaCarSide className="me-1" /> Drivers
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link navbar-link-ucab ${isActive ? 'active' : ''}`
                        }
                        to="/admin/rides"
                      >
                        <FaTaxi className="me-1" /> Bookings
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {token ? (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link navbar-link-ucab d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`
                  }
                  to={
                    user?.role === 'admin'
                      ? '/admin/settings'
                      : user?.role === 'driver'
                        ? '/driver/settings'
                        : '/profile'
                  }
                >
                  <FaUserCircle className="fs-4" />
                  <span className="small fw-semibold">{user?.fullName || 'Profile'}</span>
                </NavLink>
                <button
                  onClick={logout}
                  className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                  <span className="d-none d-sm-inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm px-3" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-ucab btn-sm px-3" to="/register">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
