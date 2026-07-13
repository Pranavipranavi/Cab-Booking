import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaSearch, FaGift, FaPlusCircle, FaSave } from 'react-icons/fa';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
  code: yup.string().required('Coupon code is required'),
  discountType: yup.string().isIn(['percentage', 'flat']).required('Discount type is required'),
  discountValue: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'Value must be at least 1')
    .required(),
  minBookingAmount: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .required(),
  expiryDate: yup.date().typeError('Must be a valid date').required(),
  maxUses: yup.number().typeError('Must be a number').min(1, 'At least 1 use').required(),
});

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchCouponsList = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllCoupons();
      if (res && res.success) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponsList();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await adminService.createCoupon(data);
      if (res && res.success) {
        toast.success(`Coupon ${data.code} created successfully!`);
        setShowAddModal(false);
        reset();
        fetchCouponsList();
      }
    } catch (err) {
      toast.error(err || 'Failed to create coupon');
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && coupons.length === 0) {
    return <Loader message="Accessing coupons register..." />;
  }

  return (
    <div className="admin-coupons-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-black mb-1">Promo Coupons Directory</h2>
          <p className="text-muted">
            Generate discount codes, set spending limits, and track usage periods.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary-ucab"
          icon={<FaPlusCircle />}
        >
          New Coupon
        </Button>
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
              placeholder="Search coupons by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredCoupons.length === 0 ? (
        <EmptyState
          title="No Active Coupons"
          description="Click New Coupon to generate promotional codes."
          icon={<FaGift className="text-muted fs-1 mb-3" />}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th>Promo Code</th>
                <th>Discount Value</th>
                <th>Min Spending Limit</th>
                <th>Limit / Uses</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaGift className="text-secondary" />
                      <strong className="text-black">{coupon.code}</strong>
                    </div>
                  </td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% Off`
                      : `$${coupon.discountValue} Off`}
                  </td>
                  <td>${coupon.minBookingAmount}</td>
                  <td>
                    {coupon.usedCount} / {coupon.maxUses}
                  </td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        new Date(coupon.expiryDate) > new Date() ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-black">Generate Promo Coupon</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body py-4">
                  <Input
                    label="Promo Coupon Code"
                    placeholder="e.g. MONSOON20"
                    error={errors.code?.message}
                    {...register('code')}
                  />

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold text-black small">
                          Discount Category
                        </label>
                        <select
                          className={`form-select ${errors.discountType ? 'is-invalid' : ''}`}
                          {...register('discountType')}
                        >
                          <option value="">Select Category</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Cash ($)</option>
                        </select>
                        {errors.discountType && (
                          <div className="invalid-feedback">{errors.discountType.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <Input
                        label="Discount Value"
                        type="number"
                        placeholder="15"
                        error={errors.discountValue?.message}
                        {...register('discountValue')}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Input
                        label="Min Booking Fare ($)"
                        type="number"
                        placeholder="10"
                        error={errors.minBookingAmount?.message}
                        {...register('minBookingAmount')}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        label="Total Max Uses"
                        type="number"
                        placeholder="100"
                        error={errors.maxUses?.message}
                        {...register('maxUses')}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-black small">Expiry Date</label>
                    <input
                      type="date"
                      className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                      {...register('expiryDate')}
                    />
                    {errors.expiryDate && (
                      <div className="invalid-feedback">{errors.expiryDate.message}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <Button variant="outline-dark" size="sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary-ucab"
                    size="sm"
                    loading={isSubmitting}
                    icon={<FaSave />}
                  >
                    Save Coupon
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
