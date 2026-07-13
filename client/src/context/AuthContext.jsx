/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';
import userService from '../services/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Fetch current user details
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      if (res && res.success) {
        setUser(res.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initialize and load user if token exists on boot
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res && res.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        navigate('/dashboard');
        return { success: true };
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res && res.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        navigate('/dashboard');
        return { success: true };
      }
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await userService.getProfile();
      if (res && res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
