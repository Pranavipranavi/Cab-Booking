import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaLock, FaBell, FaPalette, FaTrashAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import userService from '../../services/userService.js';
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
    .required('Confirm new password is required'),
});

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onChangePassword = async () => {
    // Stub changing password trigger
    toast.info('Simulated Password Update Request Sent!');
    reset();
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.'
      )
    )
      return;
    try {
      await userService.deleteAccount();
      toast.success('Your account has been deleted.');
      logout();
    } catch (err) {
      toast.error(err || 'Failed to delete account');
    }
  };

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Settings</h2>
          <p className="text-muted">
            Configure your password, notification priorities, and interface styling.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Change password */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaLock className="text-yellow" />
              <span>Update Password</span>
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
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>

        {/* Notifications and theme settings */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaBell className="text-yellow" />
              <span>Notification Preferences</span>
            </h5>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
              <label className="form-check-label text-black fw-semibold small" htmlFor="emailNotif">
                Email Notifications
              </label>
              <small className="d-block text-muted">
                Receive trip invoices and wallet receipts
              </small>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="smsNotif" defaultChecked />
              <label className="form-check-label text-black fw-semibold small" htmlFor="smsNotif">
                SMS Booking Reminders
              </label>
              <small className="d-block text-muted">Receive OTPs and driver arrival alerts</small>
            </div>
          </div>

          <div className="card border p-4 shadow-sm rounded-4 mb-4">
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

          {/* Danger zone */}
          <div className="card border border-danger p-4 shadow-sm rounded-4 bg-danger bg-opacity-5">
            <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
              <FaTrashAlt />
              <span>Danger Zone</span>
            </h5>
            <p className="text-muted small mb-4">
              Once you delete your account, your wallet balances, favorites, and trip histories will
              be permanently removed.
            </p>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
