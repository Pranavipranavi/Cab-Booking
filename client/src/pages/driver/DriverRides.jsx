import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaTaxi,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaKey,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import driverService from '../../services/driverService.js';
import rideService from '../../services/rideService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import MapView from '../../components/common/MapView.jsx';

export default function DriverRides() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Extract rideId from query params ?rideId=xxx
  const query = new URLSearchParams(location.search);
  const rideId = query.get('rideId');

  const fetchRideData = useCallback(async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await rideService.getRideDetails(rideId);
      if (res && res.success) {
        setRide(res.data);
      }
    } catch (err) {
      console.error('Failed to load ride details:', err);
      toast.error('Could not load ride details.');
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRideData();
  }, [fetchRideData]);

  const handleMarkArrived = async () => {
    setSubmittingAction(true);
    try {
      const res = await driverService.driverArriving(ride._id);
      if (res && res.success) {
        toast.success('Passenger notified of your arrival!');
        fetchRideData();
      }
    } catch (err) {
      toast.error(err || 'Failed to update status');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleStartRide = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }
    setSubmittingAction(true);
    try {
      const res = await driverService.startRide(ride._id, otpInput);
      if (res && res.success) {
        toast.success('OTP verified! Trip started successfully.');
        setOtpInput('');
        fetchRideData();
      }
    } catch (err) {
      toast.error(err || 'Failed to verify OTP');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleCompleteRide = async () => {
    setSubmittingAction(true);
    try {
      const res = await driverService.completeRide(ride._id);
      if (res && res.success) {
        toast.success('Trip completed successfully!');
        fetchRideData();
      }
    } catch (err) {
      toast.error(err || 'Failed to complete trip');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleCancelRide = async () => {
    const reason = window.prompt('Enter reason for cancelling this trip:');
    if (reason === null) return; // cancelled prompt
    setSubmittingAction(true);
    try {
      await rideService.cancelRide(ride._id, reason || 'Cancelled by driver');
      toast.success('Ride cancelled.');
      navigate('/driver/dashboard');
    } catch (err) {
      toast.error(err || 'Failed to cancel ride');
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return <Loader message="Loading trip records..." />;
  }

  if (!ride) {
    return (
      <div className="text-center py-5">
        <h4 className="fw-bold text-black mb-3">No Active Trip Selected</h4>
        <p className="text-muted small mb-4">Go to your dashboard to review pending requests.</p>
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="driver-rides-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="btn btn-link text-muted p-0 text-decoration-none small d-flex align-items-center gap-2 mb-2"
          >
            <FaArrowLeft /> Dashboard
          </button>
          <h2 className="fw-bold text-black mb-0">Active Job Panel</h2>
        </div>
        <span
          className={`badge ${
            ride.rideStatus === 'completed'
              ? 'bg-success'
              : ride.rideStatus === 'cancelled'
                ? 'bg-danger'
                : 'bg-warning text-dark'
          } text-capitalize px-3 py-2 fs-6`}
        >
          {ride.rideStatus}
        </span>
      </div>

      <div className="row g-4">
        {/* Main workflow control card */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-black mb-4">Workflow Actions</h5>

              {/* Status details */}
              <div className="p-3 bg-light rounded-3 mb-4 border">
                <span className="small text-muted d-block">Current Step</span>
                {ride.rideStatus === 'accepted' && (
                  <strong className="text-black text-uppercase">Drive to Passenger Pickup</strong>
                )}
                {ride.rideStatus === 'arrived' && (
                  <strong className="text-black text-uppercase">Awaiting OTP Verification</strong>
                )}
                {ride.rideStatus === 'in_progress' && (
                  <strong className="text-black text-uppercase">Ongoing Ride Trip</strong>
                )}
                {ride.rideStatus === 'completed' && (
                  <strong className="text-success text-uppercase">
                    Trip Completed Successfully
                  </strong>
                )}
                {ride.rideStatus === 'cancelled' && (
                  <strong className="text-danger text-uppercase">Trip Cancelled</strong>
                )}
              </div>

              {/* Step 1: Accepted - Driver needs to navigate and arrive */}
              {ride.rideStatus === 'accepted' && (
                <div className="text-center py-4">
                  <FaLocationArrow className="text-yellow fs-1 mb-3 animate-bounce" />
                  <p className="text-muted small mb-4">
                    Drive safely to the passenger&apos;s pickup address. Once you have arrived at the
                    location, mark your status.
                  </p>
                  <Button
                    onClick={handleMarkArrived}
                    variant="primary-ucab"
                    className="w-100 py-2.5"
                    loading={submittingAction}
                  >
                    Mark as Arrived
                  </Button>
                </div>
              )}

              {/* Step 2: Arrived - Enter OTP */}
              {ride.rideStatus === 'arrived' && (
                <div>
                  <div className="text-center py-3 mb-3">
                    <FaKey className="text-yellow fs-1 mb-2" />
                    <p className="text-muted small">
                      Request the 4-digit verification OTP from the passenger to commence the trip.
                    </p>
                  </div>
                  <form onSubmit={handleStartRide}>
                    <div className="mb-4">
                      <input
                        type="text"
                        maxLength="4"
                        className="form-control text-center fs-2 fw-bold tracking-widest rounded-3"
                        placeholder="••••"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary-ucab"
                      className="w-100 py-2.5"
                      loading={submittingAction}
                    >
                      Verify & Start Ride
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 3: In Progress - Complete Ride */}
              {ride.rideStatus === 'in_progress' && (
                <div className="text-center py-4">
                  <FaTaxi className="text-yellow fs-1 mb-3" />
                  <p className="text-muted small mb-4">
                    Trip is currently in progress. Drive safely to the destination. Click the button
                    below once you reach the drop address.
                  </p>
                  <Button
                    onClick={handleCompleteRide}
                    variant="primary-ucab"
                    className="w-100 py-2.5"
                    loading={submittingAction}
                  >
                    Complete Ride
                  </Button>
                </div>
              )}

              {/* Completed view */}
              {ride.rideStatus === 'completed' && (
                <div className="text-center py-4">
                  <FaCheckCircle className="text-success fs-1 mb-3" />
                  <h4 className="fw-bold text-black">Trip Finished!</h4>
                  <p className="text-muted small">
                    This trip was billed to the passenger&apos;s wallet. Your share has been credited to
                    your earnings account.
                  </p>
                  <button
                    onClick={() => navigate('/driver/dashboard')}
                    className="btn btn-outline-dark w-100 py-2 rounded-3 mt-3"
                  >
                    Go Back to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {['accepted', 'arrived'].includes(ride.rideStatus) && (
              <div className="border-top pt-3 mt-4">
                <Button
                  variant="outline-danger"
                  className="w-100 py-2"
                  onClick={handleCancelRide}
                  disabled={submittingAction}
                >
                  Cancel Ride
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Passenger details card */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 bg-light h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-black mb-4 font-sans">Trip Route Details</h5>
              <MapView
                pickup={ride.pickupAddress}
                destination={ride.dropAddress}
                rideId={ride._id}
                isDriver={true}
              />

              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 py-2.5 border-bottom border-secondary border-opacity-10">
                  <FaLocationArrow className="text-success fs-5" />
                  <div>
                    <small className="text-muted d-block">Pickup Location</small>
                    <span className="fw-bold small">{ride.pickupAddress}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 py-2.5 border-bottom border-secondary border-opacity-10">
                  <FaMapMarkerAlt className="text-danger fs-5" />
                  <div>
                    <small className="text-muted d-block">Destination Dropoff</small>
                    <span className="fw-bold small">{ride.dropAddress}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border rounded-3 mb-4">
                <span className="small text-muted d-block mb-2 fw-semibold">Passenger Profile</span>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-circle text-muted font-weight-bold">
                    {ride.rider.fullName.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{ride.rider.fullName}</h6>
                    <small className="text-muted">{ride.rider.phoneNumber}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border rounded-3 text-center">
              <span className="text-muted small d-block">Estimated Fare Payment</span>
              <h3 className="fw-extrabold text-black mb-0">${ride.estimatedFare}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
