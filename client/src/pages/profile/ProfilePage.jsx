import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaWallet,
  FaMapMarkerAlt,
  FaPlusCircle,
  FaTrashAlt,
  FaSave,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import userService from '../../services/userService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{9,14}$/, 'Provide a valid phone number')
    .required('Phone number is required'),
});

const topUpSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'Top up at least $1')
    .required('Amount is required'),
});

const locationSchema = yup.object().shape({
  label: yup.string().required('Label is required (e.g. Home, Office)'),
  address: yup.string().required('Address is required'),
});

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [favoriteLocations, setFavoriteLocations] = useState(user?.favoriteLocations || []);
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);

  // Forms configurations
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const {
    register: registerTopUp,
    handleSubmit: handleTopUpSubmit,
    reset: resetTopUp,
    formState: { errors: topUpErrors, isSubmitting: topUpSubmitting },
  } = useForm({
    resolver: yupResolver(topUpSchema),
  });

  const {
    register: registerLocation,
    handleSubmit: handleLocationSubmit,
    reset: resetLocation,
    formState: { errors: locationErrors, isSubmitting: locationSubmitting },
  } = useForm({
    resolver: yupResolver(locationSchema),
  });

  // Actions
  const onUpdateProfile = async (data) => {
    try {
      const res = await userService.updateProfile(data);
      if (res && res.success) {
        toast.success('Profile details updated successfully!');
        refreshProfile();
      }
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const onTopUp = async (data) => {
    try {
      const res = await userService.topUpWallet(data.amount, 'card');
      if (res && res.success) {
        toast.success(`Wallet successfully topped up by $${data.amount}!`);
        setWalletBalance(res.data.balance);
        resetTopUp();
        refreshProfile();
      }
    } catch (err) {
      toast.error(err || 'Failed to top up wallet');
    }
  };

  const onAddLocation = async (data) => {
    try {
      // Mock coordinates
      const locationData = {
        label: data.label,
        address: data.address,
        coordinates: {
          latitude: 40.7128 + Math.random() * 0.02,
          longitude: -74.006 + Math.random() * 0.02,
        },
      };

      const res = await userService.addFavoriteLocation(locationData);
      if (res && res.success) {
        toast.success('Favorite location saved!');
        setFavoriteLocations(res.data);
        resetLocation();
        refreshProfile();
      }
    } catch (err) {
      toast.error(err || 'Failed to save location');
    }
  };

  const onDeleteLocation = async (locId) => {
    if (!window.confirm('Delete this favorite location?')) return;
    try {
      const res = await userService.removeFavoriteLocation(locId);
      if (res && res.success) {
        toast.success('Favorite location deleted.');
        setFavoriteLocations(res.data);
        refreshProfile();
      }
    } catch (err) {
      toast.error(err || 'Failed to delete location');
    }
  };

  return (
    <div className="profile-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">My Account</h2>
          <p className="text-muted">
            Manage profile details, wallet balance, and favorite address shortcuts.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile update form */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold text-black mb-3 d-flex align-items-center gap-2">
              <FaUserCircle className="text-yellow" />
              <span>Personal Details</span>
            </h5>

            <div className="text-center mb-4">
              <FaUserCircle className="text-secondary" style={{ fontSize: '5rem' }} />
              <div className="mt-2">
                <span className="badge bg-dark text-uppercase">{user?.role}</span>
              </div>
            </div>

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

              <Button
                type="submit"
                variant="primary-ucab"
                className="w-100 py-2.5"
                loading={profileSubmitting}
                icon={<FaSave />}
              >
                Save Details
              </Button>
            </form>
          </div>

          {/* Wallet top up form */}
          <div className="card border p-4 shadow-sm rounded-4">
            <h5 className="fw-bold text-black mb-3 d-flex align-items-center gap-2">
              <FaWallet className="text-yellow" />
              <span>Top Up Wallet</span>
            </h5>

            <div className="p-3 bg-light rounded-3 text-center mb-4 border">
              <span className="text-muted small d-block">Current Balance</span>
              <h2 className="fw-extrabold text-black mb-0">${walletBalance.toFixed(2)}</h2>
            </div>

            <form onSubmit={handleTopUpSubmit(onTopUp)}>
              <Input
                label="Top Up Amount ($)"
                type="number"
                placeholder="10.00"
                error={topUpErrors.amount?.message}
                {...registerTopUp('amount')}
              />

              <div className="mb-3">
                <label className="form-label fw-bold text-black small">
                  Credit Card (Simulated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="4242 4242 4242 4242"
                  disabled
                />
              </div>

              <Button
                type="submit"
                variant="primary-ucab"
                className="w-100 py-2.5"
                loading={topUpSubmitting}
              >
                Process Top Up
              </Button>
            </form>
          </div>
        </div>

        {/* Favorite locations section */}
        <div className="col-lg-6">
          <div className="card border p-4 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold text-black mb-3 d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-yellow" />
              <span>Favorite Locations</span>
            </h5>

            {/* List of locations */}
            {favoriteLocations.length === 0 ? (
              <p className="text-muted small py-2">No favorite locations added yet.</p>
            ) : (
              <div className="list-group list-group-flush mb-4">
                {favoriteLocations.map((loc) => (
                  <div
                    key={loc._id}
                    className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0"
                  >
                    <div>
                      <h6 className="fw-bold mb-0 text-black">{loc.label}</h6>
                      <small className="text-muted">{loc.address}</small>
                    </div>
                    <button
                      onClick={() => onDeleteLocation(loc._id)}
                      className="btn btn-outline-danger btn-sm border-0"
                      aria-label={`Delete ${loc.label}`}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add location form */}
            <h6 className="fw-bold text-black mb-3">Add Location Shortcut</h6>
            <form onSubmit={handleLocationSubmit(onAddLocation)}>
              <Input
                label="Shortcut Label"
                placeholder="Home, Office, Gym..."
                error={locationErrors.label?.message}
                {...registerLocation('label')}
              />

              <Input
                label="Full Address"
                placeholder="123 Main Road, City Center"
                error={locationErrors.address?.message}
                {...registerLocation('address')}
              />

              <Button
                type="submit"
                variant="outline-dark"
                className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                loading={locationSubmitting}
              >
                <FaPlusCircle />
                <span>Add Favorite</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
