import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgrmlche4',
    api_key: process.env.CLOUDINARY_API_KEY || '197247279183821',
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinary;
