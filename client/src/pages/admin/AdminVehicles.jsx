import { useEffect, useState } from 'react';
import { FaSearch, FaCar, FaUser } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehiclesList = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllVehicles();
        if (res && res.success) {
          setVehicles(res.data);
        }
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiclesList();
  }, []);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && vehicles.length === 0) {
    return <Loader message="Accessing vehicles catalog..." />;
  }

  return (
    <div className="admin-vehicles-page">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Registered Vehicles</h2>
          <p className="text-muted">
            Review license plates, category divisions, and active assigned drivers.
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
              placeholder="Search vehicles by license plate, brand, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <EmptyState
          title="No Vehicles Registered"
          description="Vehicle registrations will register here."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>License Plate</th>
                <th>Brand & Model</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Assigned Driver</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaCar className="text-secondary fs-5" />
                      <strong className="text-black text-uppercase">{vehicle.vehicleNumber}</strong>
                    </div>
                  </td>
                  <td>
                    {vehicle.brand} {vehicle.model}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        vehicle.vehicleType === 'premium' ? 'bg-warning text-dark' : 'bg-dark'
                      } text-capitalize`}
                    >
                      {vehicle.vehicleType}
                    </span>
                  </td>
                  <td>{vehicle.seatingCapacity} Seats</td>
                  <td>
                    {vehicle.driver ? (
                      <span className="d-inline-flex align-items-center gap-2 text-black fw-semibold">
                        <FaUser className="text-muted" />
                        {vehicle.driver.fullName}
                      </span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
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
