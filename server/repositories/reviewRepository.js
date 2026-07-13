import Review from '../models/ReviewModel.js';

export const reviewRepository = {
  create: async (reviewData) => {
    const review = new Review(reviewData);
    return await review.save();
  },

  findById: async (id) => {
    return await Review.findById(id).populate('user').populate('driver').populate('ride').exec();
  },

  findByDriverId: async (driverId) => {
    return await Review.find({ driver: driverId }).populate('user').exec();
  },

  findByRiderId: async (riderId) => {
    return await Review.find({ user: riderId }).populate('driver').exec();
  },

  findAll: async (filter = {}) => {
    return await Review.find(filter).populate('user').populate('driver').exec();
  },

  getAverageRatingForDriver: async (driverId) => {
    const stats = await Review.aggregate([
      { $match: { driver: driverId } },
      {
        $group: {
          _id: '$driver',
          avgRating: { $avg: '$rating' },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      return {
        averageRating: parseFloat(stats[0].avgRating.toFixed(2)),
        totalReviews: stats[0].numReviews,
      };
    }

    return { averageRating: 5.0, totalReviews: 0 };
  },
};

export default reviewRepository;
