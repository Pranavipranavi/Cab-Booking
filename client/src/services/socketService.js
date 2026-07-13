import { io } from 'socket.io-client';

let socket = null;

export const socketService = {
  connect: (token) => {
    if (socket) return socket;

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(serverUrl, {
      auth: { token },
      autoConnect: true,
      reconnection: true
    });

    socket.on('connect', () => {
      console.log('Connected to UCab real-time server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Disconnected from real-time server.');
    }
  },

  joinRideRoom: (rideId) => {
    if (socket) {
      socket.emit('join_ride_room', rideId);
    }
  },

  emitLocationUpdate: (rideId, latitude, longitude, heading = 0) => {
    if (socket) {
      socket.emit('update_location', { rideId, latitude, longitude, heading });
    }
  },

  onDriverLocationChanged: (callback) => {
    if (socket) {
      socket.on('driver_location_changed', callback);
    }
    return () => {
      if (socket) socket.off('driver_location_changed', callback);
    };
  },

  onRideStatusUpdated: (callback) => {
    if (socket) {
      socket.on('ride_status_updated', callback);
    }
    return () => {
      if (socket) socket.off('ride_status_updated', callback);
    };
  }
};

export default socketService;
