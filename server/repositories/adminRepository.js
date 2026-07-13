import Admin from '../models/AdminModel.js';

export const adminRepository = {
  create: async (adminData) => {
    const admin = new Admin(adminData);
    return await admin.save();
  },

  findByEmail: async (email, selectPassword = false) => {
    let query = Admin.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query.exec();
  },

  findById: async (id) => {
    return await Admin.findById(id).exec();
  },

  findAll: async (filter = {}) => {
    return await Admin.find(filter).exec();
  },
};

export default adminRepository;
