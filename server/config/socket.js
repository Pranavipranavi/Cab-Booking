import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let ioInstance = null;

export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication Middleware for Socket.IO
  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      socket.user = decoded;
      next();
    } catch {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`Socket Client Connected: ${socket.id} (User: ${socket.user.id}, Role: ${socket.user.role})`);

    // Join room corresponding to User ID
    socket.join(socket.user.id);

    // Join room corresponding to active Ride ID
    socket.on('join_ride_room', (rideId) => {
      socket.join(rideId);
      console.log(`Socket ${socket.id} joined ride room: ${rideId}`);
    });

    // Driver location updates channel
    socket.on('update_location', (data) => {
      const { rideId, latitude, longitude, heading } = data;
      if (socket.user.role === 'driver') {
        // Broadcast coordinates to matched rider in the ride room
        ioInstance.to(rideId).emit('driver_location_changed', {
          latitude,
          longitude,
          heading
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Client Disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized!');
  }
  return ioInstance;
};

// Helper utility to notify users of ride state transitions
export const emitRideUpdate = (rideId, eventName, payload) => {
  if (ioInstance) {
    ioInstance.to(rideId).emit(eventName, payload);
    console.log(`Emitted event ${eventName} to ride room ${rideId}`);
  }
};
