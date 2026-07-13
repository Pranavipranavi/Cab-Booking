import { useState, useEffect } from 'react';
import { useRide } from '../../context/RideContext.jsx';
import rideService from '../../services/rideService.js';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function MyRides() {
  const { rideHistory, fetchRideHistory, loading } = useRide();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRideForReview, setSelectedRideForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRideHistory();
  }, [fetchRideHistory]);

  // Filters logic
  const filteredRides = rideHistory.filter((ride) => {
    const matchesSearch =
      ride.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'all' || ride.rideStatus === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleOpenReviewModal = (ride) => {
    setSelectedRideForReview(ride);
    setRating(5);
    setComment('');
  };

  const handleCloseReviewModal = () => {
    setSelectedRideForReview(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedRideForReview) return;
    setSubmittingReview(true);
    try {
      await rideService.submitReview({
        rideId: selectedRideForReview._id,
        rating,
        comment,
      });
      toast.success('Thank you for your rating review!');
      handleCloseReviewModal();
      fetchRideHistory();
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="my-rides-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">My Trips</h2>
          <p className="text-muted">Review your ride history, statuses, and invoices.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by pick up or destination address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2">
            <FaFilter className="text-muted" />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Trips</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
              <option value="arrived">Arrived</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ride History Results */}
      {loading && rideHistory.length === 0 ? (
        <Loader message="Loading trip history..." />
      ) : filteredRides.length === 0 ? (
        <EmptyState
          title="No rides found"
          description="Try modifying your search keywords or state filters."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Date</th>
                <th>Route Info</th>
                <th>Fare</th>
                <th>Driver / Vehicle</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredRides.map((ride) => (
                <tr key={ride._id}>
                  <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '250px' }}>
                      From: {ride.pickupAddress}
                    </div>
                    <div className="text-muted text-truncate" style={{ maxWidth: '250px' }}>
                      To: {ride.dropAddress}
                    </div>
                  </td>
                  <td>
                    <div className="fw-bold">${ride.finalFare || ride.estimatedFare}</div>
                    <small
                      className={`badge ${
                        ride.paymentStatus === 'completed'
                          ? 'bg-success-subtle text-success'
                          : 'bg-warning-subtle text-warning'
                      } border`}
                    >
                      Pay: {ride.paymentStatus}
                    </small>
                  </td>
                  <td>
                    {ride.driver ? (
                      <div>
                        <div>{ride.driver.fullName}</div>
                        <small className="text-muted">
                          {ride.vehicle?.brand} ({ride.vehicle?.vehicleNumber})
                        </small>
                      </div>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        ride.rideStatus === 'completed'
                          ? 'bg-success'
                          : ride.rideStatus === 'cancelled'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                      } text-capitalize`}
                    >
                      {ride.rideStatus}
                    </span>
                  </td>
                  <td>
                    {ride.rideStatus === 'completed' && (
                      <Button
                        variant="warning text-dark"
                        size="sm"
                        onClick={() => handleOpenReviewModal(ride)}
                      >
                        <FaStar />
                        <span>Review</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review & Star Rating Modal */}
      {selectedRideForReview && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-black">Rate Your Journey</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseReviewModal}
                ></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body py-4 text-center">
                  <p className="text-muted small mb-4">
                    How was your experience with driver {selectedRideForReview.driver?.fullName}?
                    Give a rating and review comments.
                  </p>

                  {/* Star Rating selector */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        className="btn p-0 border-0"
                      >
                        <FaStar
                          className={`fs-1 transition-all ${
                            starValue <= rating
                              ? 'text-warning scale-110'
                              : 'text-light border-dark'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="text-start">
                    <label className="form-label fw-bold small">Comments (Optional)</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Write feedback for your driver..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <Button variant="outline-dark" size="sm" onClick={handleCloseReviewModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary-ucab" size="sm" loading={submittingReview}>
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
