import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaLock, FaBell, FaPalette, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTheme } from '../../context/ThemeContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onChangePassword = async () => {
    toast.info('Simulated Password Update Request Sent!');
    reset();
  };

  return (
    <div className="admin-settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Admin Configuration</h2>
          <p className="text-muted">
            Configure your password credentials and interface preferences.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Update Password */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaLock className="text-yellow" />
              <span>Update Credentials</span>
            </h5>

            <form onSubmit={handleSubmit(onChangePassword)}>
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}
              />

              <Button
                type="submit"
                variant="primary-ucab"
                className="w-100 py-2.5"
                loading={isSubmitting}
                icon={<FaSave />}
              >
                Save Password
              </Button>
            </form>
          </div>
        </div>

        {/* Global toggles */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaBell className="text-yellow" />
              <span>System Toggles</span>
            </h5>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="driverApprovalAlert"
                defaultChecked
              />
              <label
                className="form-check-label text-black fw-semibold small"
                htmlFor="driverApprovalAlert"
              >
                Driver Registration Alerts
              </label>
              <small className="d-block text-muted">
                Receive email notification when drivers register a new profile
              </small>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="bookingEscalations"
                defaultChecked
              />
              <label
                className="form-check-label text-black fw-semibold small"
                htmlFor="bookingEscalations"
              >
                Booking Timeout Escalations
              </label>
              <small className="d-block text-muted">
                Automatically cancel unassigned ride requests after 10 minutes
              </small>
            </div>
          </div>

          <div className="card border p-4 shadow-sm rounded-4">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaPalette className="text-yellow" />
              <span>App Theme</span>
            </h5>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong className="d-block small text-black">Interface Styling Mode</strong>
                <small className="text-muted">Toggle between light and dark themes</small>
              </div>
              <button onClick={toggleTheme} className="btn btn-outline-dark btn-sm text-capitalize">
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
