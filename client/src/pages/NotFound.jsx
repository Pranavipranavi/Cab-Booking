import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="row justify-content-center text-center py-5">
      <div className="col-md-6 col-lg-5">
        <div className="ucab-card shadow-lg py-5">
          <FaExclamationTriangle className="text-yellow fs-1 mb-4" style={{ fontSize: '4rem' }} />
          <h1 className="display-4 fw-bold text-black mb-2">404</h1>
          <h3 className="fw-bold mb-3">Page Not Found</h3>
          <p className="text-muted mb-4">
            The page you are looking for does not exist or has been moved to another URL.
          </p>
          <Link to="/" className="btn btn-primary-ucab d-inline-flex align-items-center gap-2">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
