import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must be authored by a user'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Review must evaluate a driver'],
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Review must belong to a ride'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique review per passenger, driver, and ride
ReviewSchema.index({ user: 1, driver: 1, ride: 1 }, { unique: true });
ReviewSchema.index({ driver: 1 });

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
