export default function Loader({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center bg-white position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: 9999 }}
      >
        <div
          className="spinner-border text-warning mb-3"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="fw-bold text-dark">{message}</h5>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100">
      <div className="spinner-border text-warning mb-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="text-muted small mb-0">{message}</p>}
    </div>
  );
}
