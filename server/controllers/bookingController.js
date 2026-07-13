import bookingService from '../services/bookingService.js';
import { emitRideUpdate } from '../config/socket.js';

export const bookingController = {
  bookRide: async (req, res, next) => {
    try {
      const ride = await bookingService.bookRide(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Ride booking request created successfully',
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  getRideDetails: async (req, res, next) => {
    try {
      const ride = await bookingService.getRideDetails(
        req.user.id,
        req.user.role,
        req.params.rideId
      );
      res.status(200).json({
        success: true,
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelRide: async (req, res, next) => {
    try {
      const { cancellationReason } = req.body;
      const ride = await bookingService.cancelRide(
        req.user.id,
        req.user.role,
        req.params.rideId,
        cancellationReason
      );
      emitRideUpdate(ride._id, 'ride_status_updated', ride);
      res.status(200).json({
        success: true,
        message: 'Ride cancelled successfully',
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  driverArriving: async (req, res, next) => {
    try {
      const ride = await bookingService.driverArriving(req.user.id, req.params.rideId);
      emitRideUpdate(ride._id, 'ride_status_updated', ride);
      res.status(200).json({
        success: true,
        message: 'Driver marked as arrived at pickup location',
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOtpAndStartRide: async (req, res, next) => {
    try {
      const { otp } = req.body;
      const ride = await bookingService.verifyOtpAndStartRide(req.user.id, req.params.rideId, otp);
      emitRideUpdate(ride._id, 'ride_status_updated', ride);
      res.status(200).json({
        success: true,
        message: 'OTP verified. Ride started.',
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  completeRide: async (req, res, next) => {
    try {
      const ride = await bookingService.completeRide(req.user.id, req.params.rideId);
      emitRideUpdate(ride._id, 'ride_status_updated', ride);
      res.status(200).json({
        success: true,
        message: 'Ride marked as completed.',
        data: ride,
      });
    } catch (error) {
      next(error);
    }
  },

  getRideHistory: async (req, res, next) => {
    try {
      const history = await bookingService.getRideHistory(req.user.id, req.user.role);
      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default bookingController;
