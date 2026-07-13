/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import rideService from '../services/rideService.js';
import { useAuth } from './AuthContext.jsx';
import socketService from '../services/socketService.js';

const RideContext = createContext(null);

export const RideProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch ride history
  const fetchRideHistory = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await rideService.getRideHistory();
      if (res && res.success) {
        setRideHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load ride history:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if passenger has active ride
  const checkActiveRide = useCallback(async () => {
    if (!user) return;
    try {
      const res = await rideService.getRideHistory();
      if (res && res.success) {
        // Find if any ride is in active state (requested, accepted, arrived, in_progress)
        const active = res.data.find((ride) =>
          ['requested', 'accepted', 'arrived', 'in_progress'].includes(ride.rideStatus)
        );
        if (active) {
          // Fetch full ride details to include driver vehicle if assigned
          const detailsRes = await rideService.getRideDetails(active._id);
          if (detailsRes && detailsRes.success) {
            setActiveRide(detailsRes.data);
          }
        } else {
          setActiveRide(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch active ride:', err);
    }
  }, [user]);

  // Run on user login state change
  useEffect(() => {
    if (user) {
      checkActiveRide();
      fetchRideHistory();
    } else {
      setActiveRide(null);
      setRideHistory([]);
    }
  }, [user, checkActiveRide, fetchRideHistory]);

  // Real-time synchronization using Socket.IO
  useEffect(() => {
    if (token) {
      const socket = socketService.connect(token);

      socket.on('ride_status_updated', (updatedRide) => {
        console.log('Real-time Ride status update received:', updatedRide);
        if (['completed', 'cancelled'].includes(updatedRide.rideStatus)) {
          setActiveRide(null);
          fetchRideHistory();
        } else {
          setActiveRide(updatedRide);
        }
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token, fetchRideHistory]);

  const bookRide = async (bookingData) => {
    setLoading(true);
    try {
      const res = await rideService.bookRide(bookingData);
      if (res && res.success) {
        // Full details load to populate nested refs
        const detailsRes = await rideService.getRideDetails(res.data._id);
        if (detailsRes && detailsRes.success) {
          setActiveRide(detailsRes.data);
        } else {
          setActiveRide(res.data);
        }
        fetchRideHistory();
        return res.data;
      }
    } catch (err) {
      throw err.response?.data?.message || 'Booking failed';
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (rideId, reason) => {
    setLoading(true);
    try {
      const res = await rideService.cancelRide(rideId, reason);
      if (res && res.success) {
        setActiveRide(null);
        fetchRideHistory();
        return res.data;
      }
    } catch (err) {
      throw err.response?.data?.message || 'Cancellation failed';
    } finally {
      setLoading(false);
    }
  };

  const completeActiveRideState = () => {
    setActiveRide(null);
    fetchRideHistory();
  };

  return (
    <RideContext.Provider
      value={{
        activeRide,
        rideHistory,
        loading,
        bookRide,
        cancelRide,
        fetchRideHistory,
        checkActiveRide,
        completeActiveRideState,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export default RideContext;
