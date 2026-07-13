import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import rideService from '../../services/rideService.js';
import { FaHistory, FaSearch, FaFilter } from 'react-icons/fa';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function DriverHistory() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await rideService.getRideHistory();
        if (res && res.success) {
          const driverRides = res.data.filter((r) => r.driver?._id === user?.id);
          setRides(driverRides);
        }
      } catch (err) {
        console.error('Failed to load driver rides history:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const filteredRides = rides.filter((r) => {
    const matchesSearch =
      r.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.dropAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rider.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'all' || r.rideStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading && rides.length === 0) {
    return <Loader message="Loading trip logs..." />;
  }

  return (
    <div className="driver-history-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Trip History</h2>
          <p className="text-muted">
            Review all your completed, active, and cancelled ride trips catalog.
          </p>
        </div>
      </div>

      {/* Filter and search */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by passenger name, pickup, dropoff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-5">
          <div className="d-flex align-items-center gap-2">
            <FaFilter className="text-muted" />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Trips</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRides.length === 0 ? (
        <EmptyState
          title="No Trips Found"
          description="We couldn't find any trips matching your query."
          icon={<FaHistory className="text-muted fs-1 mb-3" />}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Date</th>
                <th>Passenger</th>
                <th>Pickup Address</th>
                <th>Dropoff Address</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredRides.map((ride) => (
                <tr key={ride._id}>
                  <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                  <td className="fw-bold text-black">{ride.rider.fullName}</td>
                  <td className="text-truncate" style={{ maxWidth: '180px' }}>
                    {ride.pickupAddress}
                  </td>
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
  );
}
