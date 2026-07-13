import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar,
  FaStar,
  FaWallet,
  FaClock,
  FaMapMarkerAlt,
  FaCheck,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import driverService from '../../services/driverService.js';
import rideService from '../../services/rideService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function DriverDashboard() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [matchingJobId, setMatchingJobId] = useState(null);

  const loadDriverData = useCallback(async () => {
    try {
      setLoading(true);
      // Load profile
      const profileRes = await driverService.getProfile();
      if (profileRes && profileRes.success) {
        setDriver(profileRes.data);
      }

      // Load earnings
      const earningsRes = await driverService.getEarnings();
      if (earningsRes && earningsRes.success) {
        setEarnings(earningsRes.data.earnings);
      }

      // Load all rides to find active job & requested jobs queue
      const ridesRes = await rideService.getRideHistory();
      if (ridesRes && ridesRes.success) {
        const history = ridesRes.data;

        // Active job assigned to this driver
        const active = history.find(
          (ride) =>
            ride.driver?._id === user?.id &&
            ['accepted', 'arrived', 'in_progress'].includes(ride.rideStatus)
        );
        setActiveJob(active);

        // Requested queue (unassigned requested rides)
        const requests = history.filter((ride) => ride.rideStatus === 'requested' && !ride.driver);
        setRideRequests(requests);
      }
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDriverData();
    }
  }, [user, loadDriverData]);

  const handleToggleOnline = async () => {
    if (!driver) return;
    const nextStatus = driver.onlineStatus === 'online' ? 'offline' : 'online';
    setTogglingStatus(true);
    try {
      const res = await driverService.toggleStatus(nextStatus);
      if (res && res.success) {
        setDriver((prev) => ({
          ...prev,
          onlineStatus: res.data.onlineStatus,
          availability: res.data.availability,
        }));
        toast.success(`You are now ${res.data.onlineStatus}!`);
        refreshProfile();
        loadDriverData();
      }
    } catch (err) {
      toast.error(err || 'Failed to change status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleAcceptRequest = async (rideId) => {
    if (driver.onlineStatus !== 'online') {
      toast.error('You must be online to accept ride requests!');
      return;
    }
    setMatchingJobId(rideId);
    try {
      // Mock acceptance: on the server, the matched driver takes the request
      // We can update the booking details (assigning driver coordinates)
      // Since matching is stubbed on booking creation, we navigate to rides detail
      toast.success('Ride request accepted!');
      navigate(`/driver/rides?rideId=${rideId}`);
    } catch (err) {
      toast.error(err || 'Failed to accept ride request');
    } finally {
      setMatchingJobId(null);
    }
  };

  if (loading && !driver) {
    return <Loader message="Loading driver console..." />;
  }

  const isOnline = driver?.onlineStatus === 'online';

  return (
    <div className="driver-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Welcome & Online status toggle banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-light p-4 rounded-4 border">
        <div>
          <h2 className="fw-bold text-black mb-1">Welcome, {driver?.fullName || 'Driver'}!</h2>
          <p className="text-muted mb-0 small">
            Manage your status, accept incoming jobs, and track your daily earnings here.
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`spinner-grow spinner-grow-sm ${isOnline ? 'text-success' : 'text-secondary'}`}
              role="status"
            ></span>
            <span className="small fw-bold text-capitalize">
              {driver?.onlineStatus || 'offline'}
            </span>
          </div>
          <Button
            onClick={handleToggleOnline}
            variant={isOnline ? 'danger' : 'primary-ucab'}
            size="sm"
            loading={togglingStatus}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border p-3 shadow-sm rounded-4 h-100 text-center">
            <FaWallet className="text-success fs-2 mb-2 d-inline-block" />
            <span className="text-muted small d-block">{"Today's Earnings"}</span>
            <h3 className="fw-bold text-black mb-0">${earnings.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border p-3 shadow-sm rounded-4 h-100 text-center">
            <FaStar className="text-warning fs-2 mb-2 d-inline-block" />
            <span className="text-muted small d-block">Average Rating</span>
            <h3 className="fw-bold text-black mb-0">{driver?.rating.toFixed(2)} / 5</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border p-3 shadow-sm rounded-4 h-100 text-center">
            <FaCar className="text-primary fs-2 mb-2 d-inline-block" />
            <span className="text-muted small d-block">Vehicle Assigned</span>
            <h5 className="fw-bold text-black mb-0 text-truncate px-2">
              {driver?.assignedVehicle
                ? `${driver.assignedVehicle.brand} (${driver.assignedVehicle.vehicleNumber})`
                : 'None'}
            </h5>
          </div>
        </div>
      </div>

      {/* Active Job Card */}
      {activeJob && (
        <div className="card border border-warning bg-warning bg-opacity-5 p-4 rounded-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-black mb-0 d-flex align-items-center gap-2">
              <FaClock className="text-danger" />
              <span>Ongoing Active Job</span>
            </h5>
            <span className="badge bg-danger text-capitalize">{activeJob.rideStatus}</span>
          </div>

          <div className="row g-3 small mb-3">
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-1">
                <FaMapMarkerAlt className="text-success" />
                <span>
                  <strong>Pickup:</strong> {activeJob.pickupAddress}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" />
                <span>
                  <strong>Destination:</strong> {activeJob.dropAddress}
                </span>
              </div>
            </div>
            <div className="col-md-5 border-start ps-md-4">
              <div>
                <strong>Fare:</strong> ${activeJob.estimatedFare}
              </div>
              <div>
                <strong>Distance:</strong> {activeJob.distance} miles
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              onClick={() => navigate(`/driver/rides?rideId=${activeJob._id}`)}
              className="btn btn-warning btn-sm fw-bold px-3 rounded-3"
            >
              Open Job Panel
            </button>
          </div>
        </div>
      )}

      {/* Job Requests Queue */}
      <div className="card border p-4 shadow-sm rounded-4">
        <h5 className="fw-bold text-black mb-3">Available Ride Requests</h5>

        {!isOnline ? (
          <div className="text-center py-4 text-muted small">
            Go online to view and accept incoming ride requests from passengers.
          </div>
        ) : rideRequests.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No active ride requests nearby at the moment.
          </div>
        ) : (
          <div className="row g-3">
            {rideRequests.map((req) => (
              <div key={req._id} className="col-md-6">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-black">${req.estimatedFare}</span>
                    <span className="small text-muted">{req.distance} miles</span>
                  </div>

                  <div className="small mb-3">
                    <div className="text-truncate mb-1">
                      <strong>From:</strong> {req.pickupAddress}
                    </div>
                    <div className="text-truncate">
                      <strong>To:</strong> {req.dropAddress}
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="primary-ucab"
                      size="sm"
                      loading={matchingJobId === req._id}
                      onClick={() => handleAcceptRequest(req._id)}
                      icon={<FaCheck />}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
