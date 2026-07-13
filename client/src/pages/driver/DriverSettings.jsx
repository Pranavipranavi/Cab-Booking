import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaLock, FaSave, FaIdCard } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import driverService from '../../services/driverService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{9,14}$/, 'Provide a valid phone number')
    .required('Phone number is required'),
  licenseNumber: yup.string().required('License number is required'),
  identityNumber: yup.string().required('Aadhaar/Identity Card reference is required'),
});

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

export default function DriverSettings() {
  const { user, refreshProfile } = useAuth();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      licenseNumber: user?.licenseNumber || '',
      identityNumber: user?.identityNumber || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onUpdateProfile = async (data) => {
    try {
      const res = await driverService.updateProfile(data);
      if (res && res.success) {
        toast.success('Driver profile details updated!');
        refreshProfile();
      }
    } catch (err) {
      toast.error(err || 'Failed to update details');
    }
  };

  const onChangePassword = async () => {
    toast.info('Simulated Password Update Request Sent!');
    resetPassword();
  };

  return (
    <div className="driver-settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Driver Settings</h2>
          <p className="text-muted">
            Configure your personal driver profile details and credentials.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile details */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaUserCircle className="text-yellow" />
              <span>Personal Details</span>
            </h5>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
              <Input
                label="Full Name"
                type="text"
                error={profileErrors.fullName?.message}
                {...registerProfile('fullName')}
              />

              <div className="mb-3">
                <label className="form-label fw-bold text-black small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light text-muted"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
              </div>

              <Input
                label="Phone Number"
                type="tel"
                icon={<FaPhoneAlt />}
                error={profileErrors.phoneNumber?.message}
                {...registerProfile('phoneNumber')}
              />

              <Input
                label="Driver License Number"
                type="text"
                icon={<FaIdCard />}
                error={profileErrors.licenseNumber?.message}
                {...registerProfile('licenseNumber')}
              />

              <Input
                label="Government ID Card Reference"
                type="text"
                icon={<FaIdCard />}
                error={profileErrors.identityNumber?.message}
                {...registerProfile('identityNumber')}
              />

              <Button
                type="submit"
                variant="primary-ucab"
                className="w-100 py-2.5 mt-2"
                loading={profileSubmitting}
                icon={<FaSave />}
              >
                Save Details
              </Button>
            </form>
          </div>
        </div>

        {/* Change password */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-4 d-flex align-items-center gap-2">
              <FaLock className="text-yellow" />
              <span>Update Password</span>
            </h5>

            <form onSubmit={handlePasswordSubmit(onChangePassword)}>
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.confirmNewPassword?.message}
                {...registerPassword('confirmNewPassword')}
              />

              <Button
                type="submit"
                variant="primary-ucab"
                className="w-100 py-2.5"
                loading={passwordSubmitting}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
