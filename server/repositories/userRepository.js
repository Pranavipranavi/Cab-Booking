import User from '../models/UserModel.js';

export const userRepository = {
  create: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  findByEmail: async (email, selectPassword = false) => {
    let query = User.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query.exec();
  },

  findById: async (id) => {
    return await User.findById(id).exec();
  },

  updateById: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  },

  deleteById: async (id) => {
    return await User.findByIdAndDelete(id).exec();
  },

  addFavoriteLocation: async (userId, location) => {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { favoriteLocations: location } },
      { new: true, runValidators: true }
    ).exec();
  },

  removeFavoriteLocation: async (userId, locationId) => {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteLocations: { _id: locationId } } },
      { new: true }
    ).exec();
  },

  findAll: async (filter = {}) => {
    return await User.find(filter).exec();
  },
};

export default userRepository;
