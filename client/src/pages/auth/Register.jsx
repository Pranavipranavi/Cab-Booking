import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaTaxi, FaPhone } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{9,14}$/, 'Provide a valid phone number')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    const { fullName, email, password, phoneNumber } = data;
    try {
      await registerUser({ fullName, email, password, phoneNumber });
      toast.success('Registration successful!');
    } catch (err) {
      setErrorMsg(err);
      toast.error(err || 'Failed to register account');
    }
  };

  return (
    <div className="row justify-content-center py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="col-md-7 col-lg-6">
        <div className="ucab-card shadow-lg bg-white border rounded-4 p-4">
          <div className="text-center mb-4">
            <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex mb-3">
              <FaTaxi className="fs-1 text-yellow" />
            </div>
            <h2 className="fw-bold text-black mb-1">Create Account</h2>
            <p className="text-muted">Register to start booking rides in seconds</p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2" role="alert">
              <small>{errorMsg}</small>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <Input
                  label="Full Name"
                  type="text"
                  icon={<FaUser />}
                  placeholder="John Doe"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  icon={<FaPhone />}
                  placeholder="+15550000000"
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={<FaEnvelope />}
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="row">
              <div className="col-md-6">
                <Input
                  label="Password"
                  type="password"
                  icon={<FaLock />}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Confirm Password"
                  type="password"
                  icon={<FaLock />}
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
            </div>

            <div className="form-check mb-4 mt-2">
              <input className="form-check-input" type="checkbox" id="terms" required />
              <label className="form-check-label text-muted small" htmlFor="terms">
                I agree to the Terms of Service & Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              variant="primary-ucab"
              className="w-100 py-2.5"
              loading={isSubmitting}
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center mt-4 border-top pt-3">
            <p className="mb-0 text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="text-black fw-bold hover-text-yellow">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
