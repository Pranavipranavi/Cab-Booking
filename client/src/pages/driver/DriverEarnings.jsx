import { useEffect, useState } from 'react';
import { FaWallet, FaHistory } from 'react-icons/fa';
import driverService from '../../services/driverService.js';
import rideService from '../../services/rideService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function DriverEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(0);
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsLogs = async () => {
      try {
        setLoading(true);
        // Get earnings
        const earningsRes = await driverService.getEarnings();
        if (earningsRes && earningsRes.success) {
          setEarnings(earningsRes.data.earnings);
        }

        // Get completed rides
        const ridesRes = await rideService.getRideHistory();
        if (ridesRes && ridesRes.success) {
          const completed = ridesRes.data.filter(
            (r) => r.driver?._id === user?.id && r.rideStatus === 'completed'
          );
          setCompletedRides(completed);
        }
      } catch (err) {
        console.error('Failed to load earnings records:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEarningsLogs();
    }
  }, [user]);

  if (loading && completedRides.length === 0) {
    return <Loader message="Loading financial ledgers..." />;
  }

  return (
    <div className="driver-earnings-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Earnings Log</h2>
          <p className="text-muted">
            Review your total driving payouts and completed trip earnings details.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Payout balance box */}
        <div className="col-lg-4">
          <div className="card border-0 bg-black text-white p-4 shadow-md rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-white-50 small fw-bold text-uppercase">
                  Total Driving Earnings
                </span>
                <FaWallet className="text-yellow fs-3" />
              </div>
              <h1 className="display-4 fw-extrabold text-white mb-2">${earnings.toFixed(2)}</h1>
              <p className="text-white-50 small mb-0">
                Payouts processed weekly directly to bank account
              </p>
            </div>

            <div className="border-top border-secondary pt-3 mt-4">
              <span className="small text-white-50 d-block">Platform Commission Share</span>
              <strong className="text-yellow small">20% UCab Commission Applied</strong>
            </div>
          </div>
        </div>

        {/* List of payouts */}
        <div className="col-lg-8">
          <div className="card border p-4 shadow-sm rounded-4">
            <h5 className="fw-bold text-black mb-4">Trip Ledger Statement</h5>

            {completedRides.length === 0 ? (
              <EmptyState
                title="No Payout Statements"
                description="Completed rides will register payouts here automatically."
                icon={<FaHistory className="text-muted fs-1 mb-3" />}
              />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle border-0 mb-0 text-start">
                  <thead className="table-light">
                    <tr className="small text-uppercase">
                      <th>Date</th>
                      <th>Trip Route</th>
                      <th>Total Fare</th>
                      <th>Your Payout (80%)</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {completedRides.map((ride) => {
                      const totalFare = ride.finalFare || ride.estimatedFare;
                      const driverPayout = parseFloat((totalFare * 0.8).toFixed(2));
                      return (
                        <tr key={ride._id}>
                          <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div
                              className="fw-semibold text-truncate"
                              style={{ maxWidth: '200px' }}
                            >
                              From: {ride.pickupAddress}
                            </div>
                            <div className="text-muted text-truncate" style={{ maxWidth: '200px' }}>
                              To: {ride.dropAddress}
                            </div>
                          </td>
                          <td className="text-black">${totalFare.toFixed(2)}</td>
                          <td className="fw-bold text-success">${driverPayout.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
