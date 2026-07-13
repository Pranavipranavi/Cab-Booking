/**
 * Client-side constants for UCab
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

export const API_ROUTES = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  DRIVER: {
    STATUS: '/driver/status',
    VEHICLE: '/driver/vehicle',
  },
  BOOKINGS: {
    CREATE: '/booking/create',
    DETAILS: (id) => `/booking/${id}`,
    LIST: '/booking/list',
    CANCEL: (id) => `/booking/${id}/cancel`,
  },
  PAYMENTS: {
    PROCESS: '/payments/process',
    HISTORY: '/payments/history',
  },
  TRACKING: {
    LIVE: (id) => `/tracking/${id}`,
  },
};
