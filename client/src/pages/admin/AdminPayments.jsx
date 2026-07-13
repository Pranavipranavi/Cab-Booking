import { useEffect, useState } from 'react';
import { FaSearch, FaCreditCard } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPaymentsList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllPayments();
        if (res && res.success) {
          setPayments(res.data);
        }
      } catch (err) {
        console.error('Failed to load payments ledger:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentsList();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ride && p.ride.toString().includes(searchTerm))
  );

  if (loading && payments.length === 0) {
    return <Loader message="Accessing payments ledger..." />;
  }

  return (
    <div className="admin-payments-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Global Payments Transactions Ledger</h2>
          <p className="text-muted">
            Review transaction IDs, amounts, payment options, and invoice settlement records.
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
              placeholder="Search payments by Transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <EmptyState
          title="No Transactions Logged"
          description="Statements ledger is currently empty."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredPayments.map((txn) => (
                <tr key={txn._id}>
                  <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaCreditCard className="text-secondary" />
                      <code className="text-black">{txn.transactionId}</code>
                    </div>
                  </td>
                  <td className="fw-bold text-black">${txn.amount.toFixed(2)}</td>
                  <td className="text-capitalize">{txn.method}</td>
                  <td>
                    <span
                      className={`badge ${
                        txn.status === 'completed' ? 'bg-success' : 'bg-danger'
                      } text-capitalize`}
                    >
                      {txn.status}
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
