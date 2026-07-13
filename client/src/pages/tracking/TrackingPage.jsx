import { FaMapMarkedAlt, FaCar, FaUser, FaClock, FaRoute } from 'react-icons/fa';

export default function TrackingPage() {
  return (
    <div className="tracking-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Track Your Ride</h2>
          <p className="text-muted">Real-time driver location and arrival estimates.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Tracking info column */}
        <div className="col-md-5 col-lg-4">
          <div className="ucab-card shadow-md mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <FaCar className="text-yellow me-2" />
              <span>Driver Info</span>
            </h5>

            <div className="d-flex align-items-center gap-3 py-2 border-bottom">
              <div className="bg-light p-3 rounded-circle">
                <FaUser className="fs-4 text-secondary" />
              </div>
              <div>
                <h6 className="fw-bold mb-0">No Active Trip</h6>
                <p className="text-muted mb-0 small">No driver assigned</p>
              </div>
            </div>

            <div className="row g-3 py-3 text-center">
              <div className="col-6 border-end">
                <FaClock className="text-yellow fs-4 mb-2" />
                <h6 className="fw-bold mb-0">-- mins</h6>
                <p className="text-muted small mb-0">ETA</p>
              </div>
              <div className="col-6">
                <FaRoute className="text-yellow fs-4 mb-2" />
                <h6 className="fw-bold mb-0">-- miles</h6>
                <p className="text-muted small mb-0">Distance</p>
              </div>
            </div>

            <button className="btn btn-dark btn-sm w-100" disabled>
              Contact Driver
            </button>
          </div>
        </div>

        {/* Live track map placeholder */}
        <div className="col-md-7 col-lg-8">
          <div
            className="card border-0 bg-dark text-white rounded-5 shadow-lg d-flex flex-column align-items-center justify-content-center p-5"
            style={{ minHeight: '400px' }}
          >
            <FaMapMarkedAlt className="text-yellow mb-3" style={{ fontSize: '5rem' }} />
            <h4 className="fw-bold">Live Tracking Map</h4>
            <p className="text-center text-white-50">
              Real-time driver location updates using Socket.IO and Google Maps API will be
              initialized in Phase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
