import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaCar, FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import driverService from '../../services/driverService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

const schema = yup.object().shape({
  vehicleNumber: yup.string().required('License plate number is required'),
  vehicleType: yup
    .string()
    .isIn(['economy', 'premium', 'suv', 'luxury'])
    .required('Vehicle category is required'),
  brand: yup.string().required('Vehicle brand/manufacturer is required'),
  model: yup.string().required('Model description is required'),
  color: yup.string().required('Vehicle color is required'),
  seatingCapacity: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'Capacity must be at least 1')
    .required(),
  insuranceNumber: yup.string().required('Insurance details are required'),
  rcNumber: yup.string().required('Registration Certificate number is required'),
  pollutionCertificate: yup.string().required('Pollution certificate reference is required'),
});

export default function DriverVehicle() {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const loadVehicleData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await driverService.getVehicle();
      if (res && res.success && res.data) {
        setVehicle(res.data);
        // Pre-fill form values
        Object.keys(res.data).forEach((key) => {
          setValue(key, res.data[key]);
        });
      } else {
        setVehicle(null);
      }
    } catch (err) {
      console.error('Failed to load vehicle details:', err);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    loadVehicleData();
  }, [loadVehicleData]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (vehicle) {
        // Edit
        res = await driverService.updateVehicle(data);
        toast.success('Vehicle details updated successfully!');
      } else {
        // Create new
        res = await driverService.addVehicle(data);
        toast.success('Vehicle registered and linked successfully!');
      }
      setVehicle(res.data);
      setIsEditing(false);
      loadVehicleData();
    } catch (err) {
      toast.error(err || 'Failed to submit vehicle data');
    }
  };

  const handleDeleteVehicle = async () => {
    if (
      !window.confirm(
        'WARNING: Deleting your vehicle will prevent you from accepting new ride requests. Continue?'
      )
    )
      return;
    try {
      await driverService.deleteVehicle();
      toast.success('Vehicle registration deleted.');
      setVehicle(null);
      reset();
    } catch (err) {
      toast.error(err || 'Failed to delete vehicle registration');
    }
  };

  if (loading) {
    return <Loader message="Loading vehicle records..." />;
  }

  return (
    <div className="driver-vehicle-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">My Vehicle</h2>
          <p className="text-muted">
            Register and configure your vehicle details for passenger rides matching.
          </p>
        </div>
      </div>

      {!vehicle || isEditing ? (
        <div className="card border p-4 shadow-sm rounded-4">
          <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
            <FaCar className="text-yellow" />
            <span>{vehicle ? 'Edit Vehicle Details' : 'Register Vehicle'}</span>
          </h5>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <Input
                  label="License Plate Number"
                  placeholder="e.g. MH12AB1234"
                  error={errors.vehicleNumber?.message}
                  {...register('vehicleNumber')}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold text-black small">Vehicle Type</label>
                  <select
                    className={`form-select ${errors.vehicleType ? 'is-invalid' : ''}`}
                    {...register('vehicleType')}
                  >
                    <option value="">Select Category</option>
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                  </select>
                  {errors.vehicleType && (
                    <div className="invalid-feedback">{errors.vehicleType.message}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Input
                  label="Brand"
                  placeholder="e.g. Maruti Suzuki"
                  error={errors.brand?.message}
                  {...register('brand')}
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Model"
                  placeholder="e.g. Swift Dzire"
                  error={errors.model?.message}
                  {...register('model')}
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Color"
                  placeholder="e.g. Silver"
                  error={errors.color?.message}
                  {...register('color')}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Input
                  label="Seating Capacity"
                  type="number"
                  placeholder="4"
                  error={errors.seatingCapacity?.message}
                  {...register('seatingCapacity')}
                />
              </div>
              <div className="col-md-8">
                <Input
                  label="Insurance Number Details"
                  placeholder="INS-10029302-AA"
                  error={errors.insuranceNumber?.message}
                  {...register('insuranceNumber')}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Input
                  label="Registration Certificate Reference"
                  placeholder="RC-203920"
                  error={errors.rcNumber?.message}
                  {...register('rcNumber')}
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Pollution Certificate Reference"
                  placeholder="PUC-1002"
                  error={errors.pollutionCertificate?.message}
                  {...register('pollutionCertificate')}
                />
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              {vehicle && (
                <Button variant="outline-dark" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary-ucab"
                size="sm"
                loading={isSubmitting}
                icon={<FaSave />}
              >
                Save Vehicle
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card border p-4 shadow-sm rounded-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-black mb-0 d-flex align-items-center gap-2">
              <FaCar className="text-yellow" />
              <span>
                Assigned Vehicle:{' '}
                <span className="text-uppercase text-warning">{vehicle.vehicleNumber}</span>
              </span>
            </h5>
            <div className="d-flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={handleDeleteVehicle}
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>

          <div className="row g-4 text-start">
            <div className="col-md-6">
              <div className="bg-white p-3 rounded-3 border">
                <h6 className="fw-bold text-black mb-3 border-bottom pb-2">
                  Category & Specifications
                </h6>
                <p className="mb-1">
                  <strong>Brand & Model:</strong> {vehicle.brand} {vehicle.model}
                </p>
                <p className="mb-1">
                  <strong>Color:</strong> {vehicle.color}
                </p>
                <p className="mb-1 text-capitalize">
                  <strong>Category Type:</strong> {vehicle.vehicleType}
                </p>
                <p className="mb-0">
                  <strong>Seating Capacity:</strong> {vehicle.seatingCapacity} passengers
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-white p-3 rounded-3 border">
                <h6 className="fw-bold text-black mb-3 border-bottom pb-2">
                  Certifications & Records
                </h6>
                <p className="mb-1">
                  <strong>Insurance Number:</strong> {vehicle.insuranceNumber}
                </p>
                <p className="mb-1">
                  <strong>Registration Certificate:</strong> {vehicle.rcNumber}
                </p>
                <p className="mb-0">
                  <strong>Pollution Certificate:</strong> {vehicle.pollutionCertificate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
