import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Driver license number is required'],
      unique: true,
      trim: true,
    },
    identityNumber: {
      type: String, // Aadhaar / Government ID
      required: [true, 'Identity verification number is required'],
      unique: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    availability: {
      type: Boolean,
      default: false, // Online but occupied or not
    },
    onlineStatus: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    currentLocation: {
      latitude: { type: Number, default: 0.0 },
      longitude: { type: Number, default: 0.0 },
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for rapid search and spatial matching stubs
DriverSchema.index({ onlineStatus: 1 });
DriverSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;
