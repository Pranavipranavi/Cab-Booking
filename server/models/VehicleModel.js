import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Vehicle must belong to a driver'],
      unique: true, // A driver can only have one active vehicle
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number plate is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ['economy', 'premium', 'suv', 'luxury'],
      required: [true, 'Vehicle type is required'],
    },
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Vehicle color is required'],
      trim: true,
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: 1,
    },
    insuranceNumber: {
      type: String,
      required: [true, 'Insurance details are required'],
    },
    rcNumber: {
      type: String, // Registration Certificate number
      required: [true, 'Registration Certificate details are required'],
    },
    pollutionCertificate: {
      type: String,
      required: [true, 'Pollution certificate details are required'],
    },
    vehicleImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

export default Vehicle;
