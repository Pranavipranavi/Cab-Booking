import { Link } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

export default function ResetPassword() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-6 col-lg-5">
        <div className="ucab-card shadow-lg bg-white border rounded-4 p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-black mb-1">Set New Password</h2>
            <p className="text-muted">Enter and confirm your new account password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-black small">New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaLock className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-black small">Confirm New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaLock className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-ucab w-100 py-2.5 mb-3" disabled>
              Update Password (UI Only)
            </button>
          </form>

          <div className="text-center mt-3">
            <Link
              to="/login"
              className="text-black fw-bold hover-text-yellow small d-inline-flex align-items-center gap-2"
            >
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
