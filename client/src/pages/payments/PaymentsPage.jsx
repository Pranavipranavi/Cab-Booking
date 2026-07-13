import { useState, useEffect } from 'react';
import userService from '../../services/userService.js';
import paymentService from '../../services/paymentService.js';
import { FaCreditCard, FaSearch, FaFilter, FaFileDownload, FaWallet } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function PaymentsPage() {
  const [wallet, setWallet] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      // Load wallet balance
      const walletRes = await userService.getWallet();
      if (walletRes && walletRes.success) {
        setWallet(walletRes.data);
      }

      // Load transaction history
      const paymentsRes = await paymentService.getTransactionHistory();
      if (paymentsRes && paymentsRes.success) {
        setPayments(paymentsRes.data);
      }
    } catch (err) {
      console.error('Failed to load transaction data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentData();
  }, []);

  // Filter transactions
  const filteredPayments = payments.filter((p) => {
    const matchesSearch = p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownloadReceipt = (txnId) => {
    toast.info(`Downloading PDF receipt for transaction: ${txnId}`);
  };

  return (
    <div className="payments-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Billing & Transactions</h2>
          <p className="text-muted">
            Review wallet statements, transaction ledgers, and download invoices.
          </p>
        </div>
      </div>

      {loading && payments.length === 0 ? (
        <Loader message="Loading financial logs..." />
      ) : (
        <div className="row g-4">
          {/* Summary Wallet Balance Card */}
          <div className="col-lg-4">
            <div className="card border-0 bg-black text-white p-4 shadow-md rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-white-50 small fw-bold text-uppercase">Wallet Balance</span>
                  <FaWallet className="text-yellow fs-3" />
                </div>
                <h1 className="display-4 fw-extrabold text-white mb-2">
                  ${wallet ? wallet.balance.toFixed(2) : '0.00'}
                </h1>
                <p className="text-white-50 small mb-0">Available for automatic fare checkouts</p>
              </div>

              <div className="border-top border-secondary pt-3 mt-4">
                <small className="text-white-50 d-block mb-1">Last Updated</small>
                <span className="small text-white">
                  {wallet ? new Date(wallet.updatedAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {/* Transactions Statement list */}
          <div className="col-lg-8">
            <div className="card border p-4 shadow-sm rounded-4">
              <h5 className="fw-bold text-black mb-4">Transaction History</h5>

              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search by Transaction ID..."
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
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                    >
                      <option value="all">All Methods</option>
                      <option value="wallet">Wallet</option>
                      <option value="card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Transactions List table */}
              {filteredPayments.length === 0 ? (
                <EmptyState
                  title="No Transactions Found"
                  description="Your wallet invoice statement ledger is empty."
                  icon={<FaCreditCard className="text-muted fs-1 mb-3" />}
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle border-0 mb-0">
                    <thead className="table-light">
                      <tr className="small text-uppercase">
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {filteredPayments.map((txn) => (
                        <tr key={txn._id}>
                          <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                          <td>
                            <code className="text-black">{txn.transactionId}</code>
                          </td>
                          <td className="fw-bold text-black">${txn.amount}</td>
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
                          <td>
                            <button
                              onClick={() => handleDownloadReceipt(txn.transactionId)}
                              className="btn btn-link text-warning p-0 d-inline-flex align-items-center gap-1 text-decoration-none"
                              aria-label="Download receipt"
                            >
                              <FaFileDownload />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
