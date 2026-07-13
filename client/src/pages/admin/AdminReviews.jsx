import { useEffect, useState } from 'react';
import { FaSearch, FaStar, FaUser, FaQuoteLeft } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReviewsList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllReviews();
        if (res && res.success) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error('Failed to load ratings list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewsList();
  }, []);

  const filteredReviews = reviews.filter(
    (r) =>
      (r.rider && r.rider.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.driver && r.driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && reviews.length === 0) {
    return <Loader message="Accessing passenger reviews list..." />;
  }

  return (
    <div className="admin-reviews-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Passenger Feedback Reviews</h2>
          <p className="text-muted">
            Review passenger ratings, driver feedback, and journey experience logs.
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
              placeholder="Search reviews by name, feedback comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <EmptyState
          title="No Reviews Found"
          description="Trip ratings list is empty."
          icon={<FaStar className="text-muted fs-1 mb-3" />}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Date</th>
                <th>Passenger</th>
                <th>Driver Rated</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="fw-bold text-black">{review.rider?.fullName || 'Anonymous'}</td>
                  <td>
                    {review.driver ? (
                      <span className="d-inline-flex align-items-center gap-1">
                        <FaUser className="text-muted" />
                        {review.driver.fullName}
                      </span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className="d-flex align-items-center gap-1 text-warning fw-bold">
                      <FaStar />
                      {review.rating} / 5
                    </span>
                  </td>
                  <td>
                    {review.comment ? (
                      <div className="text-muted d-flex align-items-center gap-2">
                        <FaQuoteLeft className="small opacity-50" />
                        <span>{review.comment}</span>
                      </div>
                    ) : (
                      <span className="text-muted font-italic">No comment left</span>
                    )}
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
