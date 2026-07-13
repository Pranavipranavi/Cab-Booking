import express from 'express';
import multer from 'multer';
import { uploadMediaFile } from '../config/cloudinary.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Memory Storage
const storage = multer.memoryStorage();

// File Filter Validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const folder = req.user.role === 'driver' ? 'driver_docs' : 'user_avatars';
    const uploadResult = await uploadMediaFile(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
