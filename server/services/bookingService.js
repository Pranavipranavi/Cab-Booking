import rideRepository from '../repositories/rideRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import notificationRepository from '../repositories/notificationRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const bookingService = {
  /**
   * Create ride request and dispatch/match with available driver
   */
  bookRide: async (riderId, bookingData) => {
    // Check if passenger has active booking
    const activeRide = await rideRepository.findCurrentActiveRideForRider(riderId);
    if (activeRide) {
      throw new AppError('You already have an active ride request or ongoing trip', 400);
    }

    // Mock distance/duration calculation
    // In Phase 2/3, this uses maps. For now we generate random but realistic variables.
    const distance = parseFloat((Math.random() * 10 + 1).toFixed(2)); // 1 to 11 miles
    const duration = Math.round(distance * 2.5); // ~2.5 mins per mile
    const baseFare = 2.5; // base rate
    const perMileRate = 1.8; // standard economy rate
    const estimatedFare = parseFloat((baseFare + distance * perMileRate).toFixed(2));

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Look for nearby available drivers
    const pickupLat = bookingData.pickupCoordinates.latitude;
    const pickupLng = bookingData.pickupCoordinates.longitude;
    const nearbyDrivers = await driverRepository.findNearbyAvailableDrivers(pickupLat, pickupLng);

    let matchedDriverId = null;
    let assignedVehicleId = null;
    let initialStatus = 'requested';

    if (nearbyDrivers.length > 0) {
      // Simple match strategy: grab the first driver who has an assigned vehicle
      const matchedDriver = nearbyDrivers.find((d) => d.assignedVehicle);
      if (matchedDriver) {
        matchedDriverId = matchedDriver._id;
        assignedVehicleId = matchedDriver.assignedVehicle._id;
        initialStatus = 'accepted';

        // Set driver availability to occupied
        await driverRepository.updateById(matchedDriver._id, { availability: false });

        logger.info(`Matched Ride directly to Driver: ${matchedDriver._id}`);
      }
    }

    const ride = await rideRepository.create({
      rider: riderId,
      driver: matchedDriverId,
      vehicle: assignedVehicleId,
      pickupAddress: bookingData.pickupAddress,
      dropAddress: bookingData.dropAddress,
      pickupCoordinates: bookingData.pickupCoordinates,
      destinationCoordinates: bookingData.destinationCoordinates,
      distance,
      duration,
      estimatedFare,
      otp,
      rideStatus: initialStatus,
    });

    // Create system notification for rider
    await notificationRepository.create({
      recipient: riderId,
      recipientModel: 'User',
      title: 'Ride Requested',
      message: matchedDriverId
        ? 'A driver has accepted your ride request! Meet them at your pickup location.'
        : 'Finding you a ride... We will notify you once a driver is assigned.',
      type: 'booking',
    });

    if (matchedDriverId) {
      // Create notification for driver
      await notificationRepository.create({
        recipient: matchedDriverId,
        recipientModel: 'Driver',
        title: 'New Ride Assigned',
        message: `New trip from ${bookingData.pickupAddress} to ${bookingData.dropAddress}`,
        type: 'booking',
      });
    }

    return ride;
  },

  /**
   * Fetch specific ride details (passengers see OTP, drivers see OTP under validation flow)
   */
  getRideDetails: async (userId, userRole, rideId) => {
    const ride = await rideRepository.findById(rideId, true);
    if (!ride) {
      throw new AppError('Ride not found', 404);
    }

    // Auth check: Is this user the rider or assigned driver?
    const isRider = ride.rider._id.toString() === userId;
    const isDriver = ride.driver && ride.driver._id.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isRider && !isDriver && !isAdmin) {
      throw new AppError('Unauthorized access to ride details', 403);
    }

    return ride;
  },

  /**
   * Cancel Ride
   */
  cancelRide: async (userId, userRole, rideId, reason) => {
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new AppError('Ride not found', 404);
    }

    // Check permissions
    const isRider = ride.rider._id.toString() === userId;
    const isDriver = ride.driver && ride.driver._id.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isRider && !isDriver && !isAdmin) {
      throw new AppError('Unauthorized to cancel this ride', 403);
    }

    // Can only cancel if ride is not completed or already cancelled
    if (['completed', 'cancelled'].includes(ride.rideStatus)) {
      throw new AppError(`Cannot cancel a ride that is already ${ride.rideStatus}`, 400);
    }

    // Update ride status
    const updatedRide = await rideRepository.updateById(rideId, {
      rideStatus: 'cancelled',
      cancellationReason: reason || 'Cancelled by user',
    });

    // Free up driver
    if (ride.driver) {
      await driverRepository.updateById(ride.driver._id, { availability: true });

      // Notify driver if cancelled by rider
      if (isRider) {
        await notificationRepository.create({
          recipient: ride.driver._id,
          recipientModel: 'Driver',
          title: 'Ride Cancelled',
          message: 'The passenger cancelled the trip request.',
          type: 'alert',
        });
      }
    }

    // Notify rider if cancelled by driver
    if (isDriver) {
      await notificationRepository.create({
        recipient: ride.rider._id,
        recipientModel: 'User',
        title: 'Ride Cancelled by Driver',
        message: 'Your driver cancelled the booking. Please book another ride.',
        type: 'alert',
      });
    }

    logger.info(`Ride ${rideId} cancelled. Reason: ${reason}`);
    return updatedRide;
  },

  /**
   * Driver arriving at pickup location
   */
  driverArriving: async (driverId, rideId) => {
    const ride = await rideRepository.findById(rideId);
    if (!ride || !ride.driver || ride.driver._id.toString() !== driverId) {
      throw new AppError('Ride not found or not assigned to you', 404);
    }

    if (ride.rideStatus !== 'accepted') {
      throw new AppError(`Cannot mark as arrived when status is ${ride.rideStatus}`, 400);
    }

    const updated = await rideRepository.updateById(rideId, { rideStatus: 'arrived' });

    // Notify Rider
    await notificationRepository.create({
      recipient: ride.rider._id,
      recipientModel: 'User',
      title: 'Driver Arrived',
      message: 'Your driver has arrived at the pickup location. Share OTP to start ride.',
      type: 'booking',
    });

    return updated;
  },

  /**
   * Verify Ride OTP and transition to in_progress
   */
  verifyOtpAndStartRide: async (driverId, rideId, otpInput) => {
    const ride = await rideRepository.findById(rideId, true); // Fetch with OTP field
    if (!ride || !ride.driver || ride.driver._id.toString() !== driverId) {
      throw new AppError('Ride not found or not assigned to you', 404);
    }

    if (ride.rideStatus !== 'arrived' && ride.rideStatus !== 'accepted') {
      throw new AppError('Ride has already started or been completed/cancelled', 400);
    }

    if (ride.otp !== otpInput) {
      throw new AppError('Incorrect OTP entered', 400);
    }

    const updated = await rideRepository.updateById(rideId, {
      rideStatus: 'in_progress',
      startedAt: new Date(),
    });

    // Notify passenger
    await notificationRepository.create({
      recipient: ride.rider._id,
      recipientModel: 'User',
      title: 'Ride Started',
      message: 'Your trip has started. Have a safe journey!',
      type: 'booking',
    });

    logger.info(`OTP Verified. Ride ${rideId} started.`);
    return updated;
  },

  /**
   * Complete the Ride (Transitions status to completed, calculates final fare)
   */
  completeRide: async (driverId, rideId) => {
    const ride = await rideRepository.findById(rideId);
    if (!ride || !ride.driver || ride.driver._id.toString() !== driverId) {
      throw new AppError('Ride not found or not assigned to you', 404);
    }

    if (ride.rideStatus !== 'in_progress') {
      throw new AppError('Can only complete a ride that is in progress', 400);
    }

    // For Phase 2 simulation, final fare matches estimated fare
    const finalFare = ride.estimatedFare;

    const updated = await rideRepository.updateById(rideId, {
      rideStatus: 'completed',
      finalFare,
      completedAt: new Date(),
    });

    // Make driver available again
    await driverRepository.updateById(driverId, { availability: true });

    // Notify Rider
    await notificationRepository.create({
      recipient: ride.rider._id,
      recipientModel: 'User',
      title: 'Trip Completed',
      message: `You have arrived at your destination. Total fare: $${finalFare}`,
      type: 'success',
    });

    logger.info(`Ride ${rideId} completed successfully.`);
    return updated;
  },

  /**
   * Fetch Ride History for logged in User/Driver
   */
  getRideHistory: async (userId, role) => {
    if (role === 'driver') {
      return await rideRepository.findByDriverId(userId);
    }
    return await rideRepository.findByRiderId(userId);
  },
};

export default bookingService;
