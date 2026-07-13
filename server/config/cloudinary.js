import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary variables (with stub fallbacks)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ucab_mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz'
});

export const uploadMediaFile = async (fileBuffer, folder = 'ucab') => {
  return new Promise((resolve, reject) => {
    // If credentials are stubs, bypass and return mock URL
    if (process.env.CLOUDINARY_CLOUD_NAME === 'ucab_mock_cloud' || !process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('Using simulated Cloudinary upload bypass.');
      return resolve({
        secure_url: `https://res.cloudinary.com/ucab/image/upload/v12345678/${folder}/mock_image.png`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
