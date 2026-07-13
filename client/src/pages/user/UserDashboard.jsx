import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTaxi,
  FaWallet,
  FaHistory,
  FaUser,
  FaGift,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import { useRide } from '../../context/RideContext.jsx';
import userService from '../../services/userService.js';
import Button from '../../components/common/Button.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';

export default function UserDashboard() {
  const { user } = useAuth();
  const { activeRide, rideHistory, loading: rideLoading, cancelRide } = useRide();
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load Wallet
        const walletRes = await userService.getWallet();
        if (walletRes && walletRes.success) {
          setWalletBalance(walletRes.data.balance);
        }

        // Load Coupons
        await userService.applyCoupon('seed', 0).catch(() => null); // mock listing trigger
        const activeCoupons = [
          { code: 'WELCOME50', discount: '50% Off', description: 'On your first 3 rides' },
          { code: 'UCABRIDE10', discount: '$10.00 Off', description: 'For premium rides' },
        ];
        setCoupons(activeCoupons);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleCancelActiveRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel your ride?')) return;
    setCancellingId(rideId);
    try {
      await cancelRide(rideId, 'Passenger cancelled from dashboard');
      toast.success('Your ride request has been cancelled.');
    } catch (err) {
      toast.error(err || 'Failed to cancel ride');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="user-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Welcome banner */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-light p-4 rounded-4 border">
        <div>
          <h2 className="fw-bold text-black mb-1">Hello, {user?.fullName || 'Passenger'}!</h2>
          <p className="text-muted mb-0 small">
            Where would you like to travel today? Select a destination to book a ride.
          </p>
        </div>
        <div className="bg-warning text-black px-3 py-1 rounded-pill small fw-bold">Passenger</div>
      </div>

      <div className="row g-4 mb-4">
        {/* Wallet balance card */}
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 bg-black text-white p-4 shadow-sm rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-white-50 small text-uppercase fw-bold">Wallet Balance</span>
                <FaWallet className="text-yellow fs-3" />
              </div>
              {loading ? (
                <Skeleton width="120px" height="36px" className="bg-secondary" />
              ) : (
                <h1 className="display-5 fw-extrabold text-white mb-2">
                  ${walletBalance.toFixed(2)}
                </h1>
              )}
              <p className="text-white-50 small mb-0">Use wallet balance for instant bookings</p>
            </div>

            <div className="mt-4">
              <Link
                to="/profile"
                className="btn btn-warning btn-sm w-100 fw-bold py-2 rounded-3 text-black"
              >
                Top Up Wallet
              </Link>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="col-md-6 col-lg-7">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-3">Quick Actions</h5>
            <div className="row g-3">
              <div className="col-6">
                <Link
                  to="/booking"
                  className="btn btn-outline-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center gap-2"
                >
                  <FaTaxi className="fs-3 text-yellow" />
                  <span className="small fw-bold">Book Ride</span>
                </Link>
              </div>
              <div className="col-6">
                <Link
                  to="/my-rides"
                  className="btn btn-outline-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center gap-2"
                >
                  <FaHistory className="fs-3 text-primary" />
                  <span className="small fw-bold">My Trips</span>
                </Link>
              </div>
              <div className="col-6">
                <Link
                  to="/profile"
                  className="btn btn-outline-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center gap-2"
                >
                  <FaUser className="fs-3 text-success" />
                  <span className="small fw-bold">Profile Info</span>
                </Link>
              </div>
              <div className="col-6">
                <Link
                  to="/settings"
                  className="btn btn-outline-dark w-100 py-3 rounded-3 d-flex flex-column align-items-center gap-2"
                >
                  <FaGift className="fs-3 text-danger" />
                  <span className="small fw-bold">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active ride matching section */}
      {activeRide && (
        <div className="alert alert-warning border border-warning p-4 rounded-4 shadow-sm mb-4">
          <h5 className="fw-bold text-black mb-3 d-flex align-items-center gap-2">
            <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
            <span>
              Current Active Trip Status:{' '}
              <span className="text-uppercase text-danger">{activeRide.rideStatus}</span>
            </span>
          </h5>

          <div className="row g-3 small mb-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 text-muted mb-1">
                <FaMapMarkerAlt className="text-success" />
                <span>
                  <strong>Pickup:</strong> {activeRide.pickupAddress}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <FaMapMarkerAlt className="text-danger" />
                <span>
                  <strong>Destination:</strong> {activeRide.dropAddress}
                </span>
              </div>
            </div>

            <div className="col-md-6 border-start ps-md-4">
              <div className="d-flex align-items-center gap-2 text-muted mb-1">
                <FaClock />
                <span>
                  <strong>Fare estimate:</strong> ${activeRide.estimatedFare} |{' '}
                  <strong>Distance:</strong> {activeRide.distance} miles
                </span>
              </div>
              {activeRide.driver ? (
                <div className="text-black fw-bold mt-1">
                  Driver: {activeRide.driver.fullName} | Vehicle: {activeRide.vehicle?.brand}{' '}
                  {activeRide.vehicle?.model} ({activeRide.vehicle?.vehicleNumber})
                </div>
              ) : (
                <div className="text-muted mt-1 small">Matching you with nearby drivers...</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button
              variant="danger"
              size="sm"
              loading={cancellingId === activeRide._id}
              onClick={() => handleCancelActiveRide(activeRide._id)}
            >
              Cancel Request
            </Button>
          </div>
        </div>
      )}

      {/* Ride History & Promotions section */}
      <div className="row g-4">
        {/* Recent rides list */}
        <div className="col-lg-8">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-black mb-0">Recent Trips</h5>
              <Link to="/my-rides" className="text-yellow text-decoration-none small fw-bold">
                View All
              </Link>
            </div>

            {rideLoading || loading ? (
              <div className="py-3">
                <Skeleton count={3} height="40px" />
              </div>
            ) : rideHistory.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                You have not booked any rides yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small text-uppercase">
                      <th>Date</th>
                      <th>Destination</th>
                      <th>Fare</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {rideHistory.slice(0, 3).map((ride) => (
                      <tr key={ride._id}>
                        <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                        <td className="text-truncate" style={{ maxWidth: '180px' }}>
                          {ride.dropAddress}
                        </td>
                        <td className="fw-bold">${ride.finalFare || ride.estimatedFare}</td>
                        <td>
                          <span
                            className={`badge ${
                              ride.rideStatus === 'completed' ? 'bg-success' : 'bg-danger'
                            } text-capitalize`}
                          >
                            {ride.rideStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Coupons promo panel */}
        <div className="col-lg-4">
          <div className="card border p-4 shadow-sm rounded-4 h-100 bg-light">
            <h5 className="fw-bold text-black mb-3 d-flex align-items-center gap-2">
              <FaGift className="text-yellow" />
              <span>Available Coupons</span>
            </h5>

            <div className="d-flex flex-column gap-3">
              {coupons.map((coupon, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-3 border border-warning border-opacity-50"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-warning text-dark fw-bold">{coupon.code}</span>
                    <span className="fw-bold text-success small">{coupon.discount}</span>
                  </div>
                  <p className="text-muted small mb-0">{coupon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
