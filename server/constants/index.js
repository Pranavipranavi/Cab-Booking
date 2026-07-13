/**
 * Centralized constant values for the UCab server
 */

export const ROLES = {
  USER: 'user',
  DRIVER: 'driver',
  ADMIN: 'admin',
};

export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const VEHICLE_TYPES = {
  ECONOMY: 'economy',
  PREMIUM: 'premium',
  SUV: 'suv',
  LUXURY: 'luxury',
};

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USER: {
    BASE: '/api/user',
    PROFILE: '/profile',
  },
  DRIVER: {
    BASE: '/api/driver',
    STATUS: '/status',
  },
  ADMIN: {
    BASE: '/api/admin',
  },
  BOOKING: {
    BASE: '/api/booking',
  },
  TRACKING: {
    BASE: '/api/tracking',
  },
  PAYMENTS: {
    BASE: '/api/payments',
  },
};
