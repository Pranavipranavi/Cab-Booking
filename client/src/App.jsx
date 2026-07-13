import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { RideProvider } from './context/RideContext.jsx';

// Layouts & Guards
import Layout from './components/layout/Layout.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import PrivateLayout from './components/layout/PrivateLayout.jsx';
import DriverLayout from './components/layout/DriverLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import RoleGuard from './components/layout/RoleGuard.jsx';
import Loader from './components/common/Loader.jsx';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/home/Home.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));

// Passenger Pages
const UserDashboard = lazy(() => import('./pages/user/UserDashboard.jsx'));
const BookingPage = lazy(() => import('./pages/booking/BookingPage.jsx'));
const MyRides = lazy(() => import('./pages/booking/MyRides.jsx'));
const PaymentsPage = lazy(() => import('./pages/payments/PaymentsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage.jsx'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage.jsx'));

// Driver Pages
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard.jsx'));
const DriverRides = lazy(() => import('./pages/driver/DriverRides.jsx'));
const DriverVehicle = lazy(() => import('./pages/driver/DriverVehicle.jsx'));
const DriverEarnings = lazy(() => import('./pages/driver/DriverEarnings.jsx'));
const DriverSettings = lazy(() => import('./pages/driver/DriverSettings.jsx'));
const DriverHistory = lazy(() => import('./pages/driver/DriverHistory.jsx'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminDrivers = lazy(() => import('./pages/admin/AdminDrivers.jsx'));
const AdminVehicles = lazy(() => import('./pages/admin/AdminVehicles.jsx'));
const AdminRides = lazy(() => import('./pages/admin/AdminRides.jsx'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments.jsx'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons.jsx'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));

const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RideProvider>
          <Suspense fallback={<Loader fullPage message="Loading resources..." />}>
            <Routes>
              {/* Outer Layout containing Header and Footer */}
              <Route path="/" element={<Layout />}>
                {/* 1. Public Auth Routes (Redirects to dashboard if logged in) */}
                <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                </Route>

                {/* 2. Authenticated User Passenger Routes */}
                <Route element={<RoleGuard allowedRoles={['user']} />}>
                  <Route element={<PrivateLayout />}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="my-rides" element={<MyRides />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* 3. Authenticated Driver Routes */}
                <Route element={<RoleGuard allowedRoles={['driver']} />}>
                  <Route element={<DriverLayout />}>
                    <Route path="driver" element={<Navigate to="/driver/dashboard" replace />} />
                    <Route path="driver/dashboard" element={<DriverDashboard />} />
                    <Route path="driver/rides" element={<DriverRides />} />
                    <Route path="driver/history" element={<DriverHistory />} />
                    <Route path="driver/vehicle" element={<DriverVehicle />} />
                    <Route path="driver/earnings" element={<DriverEarnings />} />
                    <Route path="driver/profile" element={<DriverSettings />} />
                    <Route path="driver/settings" element={<DriverSettings />} />
                  </Route>
                </Route>

                {/* 4. Authenticated Admin Routes */}
                <Route element={<RoleGuard allowedRoles={['admin']} />}>
                  <Route element={<AdminLayout />}>
                    <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="admin/dashboard" element={<AdminDashboard />} />
                    <Route path="admin/users" element={<AdminUsers />} />
                    <Route path="admin/drivers" element={<AdminDrivers />} />
                    <Route path="admin/vehicles" element={<AdminVehicles />} />
                    <Route path="admin/rides" element={<AdminRides />} />
                    <Route path="admin/payments" element={<AdminPayments />} />
                    <Route path="admin/coupons" element={<AdminCoupons />} />
                    <Route path="admin/reviews" element={<AdminReviews />} />
                    <Route path="admin/settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                {/* 5. Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </RideProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
