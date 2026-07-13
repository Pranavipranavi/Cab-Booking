import { useEffect, useState } from 'react';
import {
  FaSearch,
  FaUserCircle,
} from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDriversList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllDrivers();
        if (res && res.success) {
          setDrivers(res.data);
        }
      } catch (err) {
        console.error('Failed to load drivers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDriversList();
  }, []);

  const handleToggleVerification = (driverId) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d._id === driverId) {
          const nextStatus = d.verificationStatus === 'verified' ? 'pending' : 'verified';
          toast.info(`Simulated Verification Update: ${d.fullName} marked as ${nextStatus}`);
          return { ...d, verificationStatus: nextStatus };
        }
        return d;
      })
    );
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && drivers.length === 0) {
    return <Loader message="Accessing driver list..." />;
  }

  return (
    <div className="admin-drivers-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Registered Drivers</h2>
          <p className="text-muted">
            Review driver accounts, license documents, and toggle verification clearances.
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
              placeholder="Search drivers by name, license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredDrivers.length === 0 ? (
        <EmptyState
          title="No Drivers Registered"
          description="Drivers will register and appear here."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Driver Name</th>
                <th>License Details</th>
                <th>Aadhaar / ID Reference</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredDrivers.map((driver) => (
                <tr key={driver._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaUserCircle className="text-secondary fs-4" />
                      <div>
                        <div className="fw-bold text-black">{driver.fullName}</div>
                        <small className="text-muted">{driver.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code>{driver.licenseNumber}</code>
                  </td>
                  <td>
                    <code>{driver.identityNumber || 'N/A'}</code>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        driver.onlineStatus === 'online' ? 'bg-success' : 'bg-secondary'
                      } text-capitalize`}
                    >
                      {driver.onlineStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        driver.verificationStatus === 'verified'
                          ? 'bg-success'
                          : 'bg-warning text-dark'
                      } text-capitalize`}
                    >
                      {driver.verificationStatus}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant={
                        driver.verificationStatus === 'verified' ? 'outline-danger' : 'primary-ucab'
                      }
                      size="sm"
                      onClick={() => handleToggleVerification(driver._id)}
                    >
                      {driver.verificationStatus === 'verified' ? 'Revoke Approval' : 'Approve'}
                    </Button>
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
