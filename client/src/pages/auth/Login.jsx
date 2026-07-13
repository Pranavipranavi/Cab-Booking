import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaTaxi } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
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
    try {
      await login(data);
      toast.success('Successfully logged in!');
    } catch (err) {
      setErrorMsg(err);
      toast.error(err || 'Failed to authenticate');
    }
  };

  return (
    <div className="row justify-content-center py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="col-md-6 col-lg-5">
        <div className="ucab-card shadow-lg bg-white border rounded-4 p-4">
          <div className="text-center mb-4">
            <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex mb-3">
              <FaTaxi className="fs-1 text-yellow" />
            </div>
            <h2 className="fw-bold text-black mb-1">Welcome Back</h2>
            <p className="text-muted">Sign in to your UCab passenger account</p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
              <small>{errorMsg}</small>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              icon={<FaEnvelope />}
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              icon={<FaLock />}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label text-muted small" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-decoration-none text-yellow small fw-bold"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary-ucab"
              className="w-100 py-2.5"
              loading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center mt-4 border-top pt-3">
            <p className="mb-0 text-muted small">
              {"Don't have an account?"}{' '}
              <Link to="/register" className="text-black fw-bold hover-text-yellow">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
