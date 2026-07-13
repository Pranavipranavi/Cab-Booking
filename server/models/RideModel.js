import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ride must have a passenger'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    dropAddress: {
      type: String,
      required: [true, 'Destination address is required'],
    },
    pickupCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destinationCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    distance: {
      type: Number, // in miles or kilometers
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    estimatedFare: {
      type: Number,
      required: true,
    },
    finalFare: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
      required: true,
      select: false,
    },
    rideStatus: {
      type: String,
      enum: ['requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RideSchema.index({ rider: 1 });
RideSchema.index({ driver: 1 });
RideSchema.index({ rideStatus: 1 });

const Ride = mongoose.model('Ride', RideSchema);

export default Ride;
