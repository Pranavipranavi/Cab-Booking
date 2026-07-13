import reviewService from '../services/reviewService.js';

export const reviewController = {
  addReview: async (req, res, next) => {
    try {
      const review = await reviewService.addReview(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  getReviews: async (req, res, next) => {
    try {
      const reviews = await reviewService.getReviewsForDriver(req.params.driverId);
      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default reviewController;
