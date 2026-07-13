import { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaCar } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRidesList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllBookings();
        if (res && res.success) {
          setRides(res.data);
        }
      } catch (err) {
        console.error('Failed to load rides registry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRidesList();
  }, []);

  const filteredRides = rides.filter(
    (r) =>
      r.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.dropAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rider.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && rides.length === 0) {
    return <Loader message="Accessing bookings registry..." />;
  }

  return (
    <div className="admin-rides-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Global Bookings Registry</h2>
          <p className="text-muted">
            Review routes details, assigned drivers, and active trip statuses.
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search bookings by passenger name, addresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredRides.length === 0 ? (
        <EmptyState title="No Bookings Found" description="Bookings history is empty." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Date</th>
                <th>Passenger</th>
                <th>Route Info</th>
                <th>Driver Assigned</th>
                <th>Estimated Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredRides.map((ride) => (
                <tr key={ride._id}>
                  <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                  <td className="fw-bold text-black">
                    <span className="d-inline-flex align-items-center gap-2">
                      <FaUser className="text-muted" />
                      {ride.rider.fullName}
                    </span>
                  </td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '180px' }}>
                      <strong>From:</strong> {ride.pickupAddress}
                    </div>
                    <div className="text-truncate text-muted" style={{ maxWidth: '180px' }}>
                      <strong>To:</strong> {ride.dropAddress}
                    </div>
                  </td>
                  <td>
                    {ride.driver ? (
                      <span className="d-inline-flex align-items-center gap-2">
                        <FaCar className="text-muted" />
                        {ride.driver.fullName}
                      </span>
                    ) : (
                      <span className="text-muted small">Looking for Driver...</span>
                    )}
                  </td>
                  <td className="fw-bold text-black">${ride.finalFare || ride.estimatedFare}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
