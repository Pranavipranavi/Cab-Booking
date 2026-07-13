import { Link } from 'react-router-dom';
import { FaTaxi, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-ucab">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-yellow fw-bold mb-3 d-flex align-items-center">
              <FaTaxi className="me-2 text-yellow" />
              <span>UCab</span>
            </h5>
            <p className="text-white-50">
              Premium smart cab booking and ride management platform. Get a ride in seconds with our
              state of the art driver dispatching.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white-50 hover-text-yellow">
                <FaFacebook className="fs-5" />
              </a>
              <a href="#" className="text-white-50 hover-text-yellow">
                <FaTwitter className="fs-5" />
              </a>
              <a href="#" className="text-white-50 hover-text-yellow">
                <FaInstagram className="fs-5" />
              </a>
              <a href="#" className="text-white-50 hover-text-yellow">
                <FaLinkedin className="fs-5" />
              </a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 hover-text-yellow">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/booking" className="text-white-50 hover-text-yellow">
                  Book Ride
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/tracking" className="text-white-50 hover-text-yellow">
                  Track Ride
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/payments" className="text-white-50 hover-text-yellow">
                  Payments
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Dashboards</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/user" className="text-white-50 hover-text-yellow">
                  User Panel
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/driver" className="text-white-50 hover-text-yellow">
                  Driver Panel
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin" className="text-white-50 hover-text-yellow">
                  Admin Control
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Contact Support</h6>
            <p className="text-white-50 mb-1">Email: support@ucab.com</p>
            <p className="text-white-50">Phone: +1 (800) 555-UCAB</p>
          </div>
        </div>
        <hr className="bg-secondary my-4" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50">
              &copy; {currentYear} UCab Inc. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <a href="#" className="text-white-50 me-3 hover-text-yellow">
              Privacy Policy
            </a>
            <a href="#" className="text-white-50 hover-text-yellow">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
