import { useEffect, useState } from 'react';
import {
  FaUsers,
  FaCarSide,
  FaCar,
  FaRoute,
  FaCreditCard,
  FaClock,
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardSummary();
        if (res && res.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <Loader message="Compiling platform metrics..." />;
  }

  // Chart 1: Revenue Trends (Line)
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Platform Revenue ($)',
        data: [12000, 15000, 14000, 18000, 22000, 24500, summary?.totalRevenue || 25000],
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart 2: Bookings Count (Bar)
  const bookingsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Rides Booked',
        data: [42, 50, 48, 62, 85, 95, 78],
        backgroundColor: '#121212',
      },
    ],
  };

  // Chart 3: Ride Status Distribution (Doughnut)
  const statusData = {
    labels: ['Active', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [summary?.activeRides || 5, 120, 25],
        backgroundColor: ['#2F80ED', '#27AE60', '#EB5757'],
        borderWidth: 1,
      },
    ],
  };

  const statCards = [
    {
      title: 'Total Passengers',
      value: summary?.totalUsers || 0,
      icon: <FaUsers />,
      color: 'primary',
    },
    {
      title: 'Registered Drivers',
      value: summary?.totalDrivers || 0,
      icon: <FaCarSide />,
      color: 'warning text-dark',
    },
    {
      title: 'Total Vehicles',
      value: summary?.totalVehicles || 0,
      icon: <FaCar />,
      color: 'success',
    },
    { title: 'Total Bookings', value: summary?.totalRides || 0, icon: <FaRoute />, color: 'info' },
    { title: 'Active Rides', value: summary?.activeRides || 0, icon: <FaClock />, color: 'danger' },
    {
      title: 'Platform Payouts',
      value: summary?.totalPayments || 0,
      icon: <FaCreditCard />,
      color: 'secondary',
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-black mb-1">Platform Analytics Dashboard</h2>
          <p className="text-muted">
            Global tracking statistics, platform transactions, and registrations audits.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-4 mb-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-sm-6 col-md-4 col-lg-4">
            <div className="card border p-3 shadow-sm rounded-4 h-100 d-flex flex-row align-items-center gap-3">
              <div
                className={`p-3 bg-${card.color.split(' ')[0]} bg-opacity-10 text-${card.color.split(' ')[0]} rounded-4`}
              >
                <span className="fs-3 d-flex align-items-center">{card.icon}</span>
              </div>
              <div>
                <span className="text-muted small d-block">{card.title}</span>
                <h4 className="fw-extrabold text-black mb-0">{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue highlights banner */}
      <div className="bg-black text-white p-4 rounded-4 shadow-sm mb-5 border d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <span className="text-white-50 small text-uppercase fw-bold">
            Platform Total Billing Turnover
          </span>
          <h1 className="display-6 fw-extrabold text-yellow mb-0">
            ${summary ? summary.totalRevenue.toFixed(2) : '0.00'}
          </h1>
        </div>
        <div className="bg-warning text-dark px-3 py-2 rounded-pill small fw-bold">
          Pending Driver Approvals: {summary?.pendingDriverRegistrations || 0}
        </div>
      </div>

      {/* Graphs workspace */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border p-4 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold text-black mb-4">Revenue Growth Trend</h5>
            <div style={{ height: '300px' }}>
              <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card border p-4 shadow-sm rounded-4">
            <h5 className="fw-bold text-black mb-4">Weekly Ride Booking Traffic</h5>
            <div style={{ height: '300px' }}>
              <Bar data={bookingsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border p-4 shadow-sm rounded-4 h-100">
            <h5 className="fw-bold text-black mb-4 text-center">Ride Status Distribution</h5>
            <div
              className="d-flex justify-content-center align-items-center mb-4"
              style={{ height: '220px' }}
            >
              <Doughnut
                data={statusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>

            <div className="d-flex flex-column gap-2 small mt-2">
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span>Active Matched Rides</span>
                <span className="fw-bold text-primary">{summary?.activeRides || 0}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span>Completed Rides</span>
                <span className="fw-bold text-success">120</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Cancelled Rides</span>
                <span className="fw-bold text-danger">25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
