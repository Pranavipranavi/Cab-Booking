import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaTaxi,
  FaRoute,
  FaClock,
  FaArrowRight,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRide } from '../../context/RideContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import MapView from '../../components/common/MapView.jsx';

const schema = yup.object().shape({
  pickupAddress: yup.string().required('Pickup location is required'),
  dropAddress: yup.string().required('Destination drop location is required'),
});

export default function BookingPage() {
  const { bookRide, loading } = useRide();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('economy');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [estimation, setEstimation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Calculate mock ride details before booking
  const handleCalculateFare = (data) => {
    // Generate realistic distance/duration metrics
    const distance = parseFloat((Math.random() * 8 + 2).toFixed(2)); // 2 to 10 miles
    const duration = Math.round(distance * 2.2); // ~2.2 mins per mile
    const baseFare = vehicleType === 'premium' ? 5.0 : 2.5;
    const perMileRate = vehicleType === 'premium' ? 2.8 : 1.8;
    const estimatedFare = parseFloat((baseFare + distance * perMileRate).toFixed(2));

    setEstimation({
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      distance,
      duration,
      estimatedFare,
      vehicleType,
    });
  };

  const handleConfirmBooking = async () => {
    if (!estimation) return;
    if (user && user.walletBalance < estimation.estimatedFare) {
      toast.error('Insufficient wallet balance. Please top up before booking!');
      return;
    }

    try {
      // Mock Coordinates
      const bookingData = {
        pickupAddress: estimation.pickupAddress,
        dropAddress: estimation.dropAddress,
        pickupCoordinates: {
          latitude: 40.7128 + Math.random() * 0.05,
          longitude: -74.006 + Math.random() * 0.05,
        },
        destinationCoordinates: {
          latitude: 40.7128 + Math.random() * 0.05,
          longitude: -74.006 + Math.random() * 0.05,
        },
      };

      await bookRide(bookingData);
      toast.success('Ride requested successfully!');
      setShowConfirmModal(false);
      navigate('/dashboard'); // Redirect to trace ride state
    } catch (err) {
      toast.error(err || 'Failed to book ride');
    }
  };

  return (
    <div className="booking-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Book a Ride</h2>
          <p className="text-muted">Enter coordinates to match with available drivers instantly.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Ride Input Form Card */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4">
            <h5 className="fw-bold text-black mb-4">Enter Trip Route</h5>

            <form onSubmit={handleSubmit(handleCalculateFare)}>
              <Input
                label="Pickup Address"
                icon={<FaLocationArrow className="text-success" />}
                placeholder="Enter pickup address (e.g. 123 Main St)"
                error={errors.pickupAddress?.message}
                {...register('pickupAddress')}
              />

              <Input
                label="Destination Address"
                icon={<FaMapMarkerAlt className="text-danger" />}
                placeholder="Enter drop location (e.g. Airport Terminal 1)"
                error={errors.dropAddress?.message}
                {...register('dropAddress')}
              />

              {/* Vehicle Type Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold text-black small d-block">
                  Select Vehicle Category
                </label>
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      onClick={() => setVehicleType('economy')}
                      className={`border rounded-4 p-3 text-center cursor-pointer transition-all ${
                        vehicleType === 'economy'
                          ? 'border-warning bg-warning bg-opacity-10 text-black shadow-sm'
                          : 'bg-light text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaTaxi
                        className={`fs-2 mb-2 ${vehicleType === 'economy' ? 'text-warning' : 'text-secondary'}`}
                      />
                      <div className="fw-bold small">UCab Economy</div>
                      <div className="small text-muted">$1.80 / mile</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      onClick={() => setVehicleType('premium')}
                      className={`border rounded-4 p-3 text-center cursor-pointer transition-all ${
                        vehicleType === 'premium'
                          ? 'border-warning bg-warning bg-opacity-10 text-black shadow-sm'
                          : 'bg-light text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaTaxi
                        className={`fs-2 mb-2 ${vehicleType === 'premium' ? 'text-warning' : 'text-secondary'}`}
                      />
                      <div className="fw-bold small">UCab Premium</div>
                      <div className="small text-muted">$2.80 / mile</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary-ucab" className="w-100 py-2.5">
                Estimate Fare
              </Button>
            </form>
          </div>
        </div>

        {/* Fare estimation details panel */}
        <div className="col-lg-6">
          {estimation ? (
            <div className="card border p-4 shadow-sm rounded-4 h-100 bg-light d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-black mb-4">Ride Estimate Summary</h5>
                <MapView
                  pickup={estimation.pickupAddress}
                  destination={estimation.dropAddress}
                />

                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <FaLocationArrow className="text-success fs-5" />
                    <div>
                      <small className="text-muted d-block">Pickup Location</small>
                      <span className="fw-semibold small">{estimation.pickupAddress}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <FaMapMarkerAlt className="text-danger fs-5" />
                    <div>
                      <small className="text-muted d-block">Destination Dropoff</small>
                      <span className="fw-semibold small">{estimation.dropAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="row g-3 text-center mb-4">
                  <div className="col-6 border-end">
                    <FaRoute className="text-muted fs-4 mb-1" />
                    <h6 className="fw-bold mb-0">{estimation.distance} miles</h6>
                    <small className="text-muted">Estimated Distance</small>
                  </div>
                  <div className="col-6">
                    <FaClock className="text-muted fs-4 mb-1" />
                    <h6 className="fw-bold mb-0">{estimation.duration} mins</h6>
                    <small className="text-muted">Estimated Duration</small>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-3 border text-center mb-4">
                  <span className="text-muted small d-block">Total Estimated Fare</span>
                  <h1 className="display-6 fw-extrabold text-black mb-0">
                    ${estimation.estimatedFare}
                  </h1>
                </div>
              </div>

              <div>
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  variant="primary-ucab"
                  className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <span>Proceed to Book</span>
                  <FaArrowRight />
                </Button>
              </div>
            </div>
          ) : (
            <div className="card border-0 bg-dark text-white rounded-4 shadow-lg p-5 text-center d-flex flex-column align-items-center justify-content-center h-100 min-height-350">
              <FaRoute className="text-warning mb-3" style={{ fontSize: '4.5rem' }} />
              <h4 className="fw-bold">No Routes Selected</h4>
              <p className="text-white-50 small max-width-350">
                Enter your pickup and destination coordinates in the form to calculate fare and
                match drivers.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmModal && estimation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-black">Confirm Ride Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted small">
                  Please review your pickup and drop off addresses before finalizing. Payment will
                  be automatically charged from your wallet once the trip is completed.
                </p>

                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <div className="mb-2">
                    <strong>Pickup:</strong>{' '}
                    <span className="small">{estimation.pickupAddress}</span>
                  </div>
                  <div>
                    <strong>Dropoff:</strong>{' '}
                    <span className="small">{estimation.dropAddress}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center bg-warning bg-opacity-10 p-3 rounded-3 border border-warning">
                  <div>
                    <span className="small text-muted d-block">Vehicle Type</span>
                    <strong className="text-capitalize text-black">{estimation.vehicleType}</strong>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted d-block">Estimated Fare</span>
                    <h5 className="fw-bold text-black mb-0">${estimation.estimatedFare}</h5>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <Button variant="outline-dark" size="sm" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary-ucab"
                  size="sm"
                  loading={loading}
                  onClick={handleConfirmBooking}
                >
                  Confirm Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
