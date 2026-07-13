/**
 * UCab Client Utility Helpers
 */

/**
 * Format date to readable string
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format numbers as currency
 * @param {number} amount
 * @param {string} [currency='USD']
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format distance in meters to kilometers or miles
 * @param {number} meters - Distance in meters
 * @param {boolean} [useMiles=false]
 * @returns {string}
 */
export const formatDistance = (meters, useMiles = false) => {
  if (meters === undefined || meters === null) return '';
  if (useMiles) {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(2)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
};

/**
 * Local Storage Wrapper
 */
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

/**
 * Validation Helper Functions
 */
export const validators = {
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },
  isValidPhone: (phone) => {
    // Simple 10-15 digit phone validation regex
    const re = /^\+?[1-9]\d{9,14}$/;
    return re.test(String(phone));
  },
  isRequired: (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  },
};
