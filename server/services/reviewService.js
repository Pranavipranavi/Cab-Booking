import reviewRepository from '../repositories/reviewRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import rideRepository from '../repositories/rideRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const reviewService = {
  addReview: async (userId, reviewData) => {
    const { rideId, rating, comment } = reviewData;

    // Check if ride exists
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new AppError('Ride not found', 404);
    }

    // Verify user is the rider of this ride
    if (ride.rider._id.toString() !== userId) {
      throw new AppError('You can only review rides you have completed', 403);
    }

    if (ride.rideStatus !== 'completed') {
      throw new AppError('You can only review completed rides', 400);
    }

    if (!ride.driver) {
      throw new AppError('No driver assigned to this ride', 400);
    }

    const driverId = ride.driver._id;

    // Check if review already exists
    const existingReviews = await reviewRepository.findByDriverId(driverId);
    const alreadyReviewed = existingReviews.some((r) => r.ride.toString() === rideId);
    if (alreadyReviewed) {
      throw new AppError('You have already submitted a review for this ride', 400);
    }

    const review = await reviewRepository.create({
      user: userId,
      driver: driverId,
      ride: rideId,
      rating,
      comment,
    });

    // Re-calculate average driver rating
    const { averageRating } = await reviewRepository.getAverageRatingForDriver(driverId);
    await driverRepository.updateById(driverId, { rating: averageRating });

    logger.info(`Review added for driver ${driverId}. New average rating: ${averageRating}`);
    return review;
  },

  getReviewsForDriver: async (driverId) => {
    const driverExists = await driverRepository.findById(driverId);
    if (!driverExists) {
      throw new AppError('Driver not found', 404);
    }
    return await reviewRepository.findByDriverId(driverId);
  },
};

export default reviewService;
