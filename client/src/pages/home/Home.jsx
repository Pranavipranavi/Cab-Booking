import { Link } from 'react-router-dom';
import { FaTaxi, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="home-page py-4">
      {/* Hero Section */}
      <div className="p-5 mb-5 bg-black text-white rounded-5 shadow-lg position-relative overflow-hidden">
        <div className="row align-items-center py-4 position-relative z-index-1">
          <div className="col-lg-7">
            <h1 className="display-4 fw-extrabold mb-3 text-yellow font-sans">
              Your Ride, On Demand.
            </h1>
            <p className="lead text-light mb-4">
              Experience the next generation of smart cab booking. Secure, fast, and optimized for
              your daily travels.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/booking" className="btn btn-primary-ucab btn-lg">
                Book a Ride Now
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-lg">
                Become a Driver
              </Link>
            </div>
          </div>
          <div className="col-lg-5 text-center d-none d-lg-block">
            <FaTaxi className="text-yellow" style={{ fontSize: '15rem', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="ucab-card h-100 text-center">
            <div className="p-3 bg-yellow bg-opacity-10 text-yellow rounded-circle d-inline-block mb-3">
              <FaTaxi className="fs-3" />
            </div>
            <h4 className="fw-bold text-black mb-3">Easy Booking</h4>
            <p className="text-muted">
              Enter your pick up and drop off locations, and get matched with the closest driver
              instantly.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ucab-card h-100 text-center">
            <div className="p-3 bg-yellow bg-opacity-10 text-yellow rounded-circle d-inline-block mb-3">
              <FaMapMarkedAlt className="fs-3" />
            </div>
            <h4 className="fw-bold text-black mb-3">Live Tracking</h4>
            <p className="text-muted">
              Watch your driver navigate to your position in real-time, with accurate estimated
              arrival times.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ucab-card h-100 text-center">
            <div className="p-3 bg-yellow bg-opacity-10 text-yellow rounded-circle d-inline-block mb-3">
              <FaShieldAlt className="fs-3" />
            </div>
            <h4 className="fw-bold text-black mb-3">Safe & Secure</h4>
            <p className="text-muted">
              All rides are monitored, drivers are verified, and secure in-app payments protect your
              info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
