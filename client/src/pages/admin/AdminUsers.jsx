import { useEffect, useState } from 'react';
import { FaSearch, FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllUsers();
        if (res && res.success) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error('Failed to load passengers catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersList();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  );

  if (loading && users.length === 0) {
    return <Loader message="Accessing passenger list..." />;
  }

  return (
    <div className="admin-users-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Registered Passengers</h2>
          <p className="text-muted">Manage, search, and verify passenger account registries.</p>
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
              placeholder="Search passengers by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No Passengers Registered"
          description="Try modifying search keywords or check network settings."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Passenger</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Wallet Balance</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredUsers.map((userItem) => (
                <tr key={userItem._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaUserCircle className="text-secondary fs-4" />
                      <span className="fw-bold text-black">{userItem.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center gap-2">
                      <FaEnvelope className="text-muted" />
                      {userItem.email}
                    </span>
                  </td>
                  <td>
                    <span className="d-inline-flex align-items-center gap-2">
                      <FaPhone className="text-muted" />
                      {userItem.phoneNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="fw-bold text-black">
                    ${userItem.walletBalance?.toFixed(2) || '0.00'}
                  </td>
                  <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
