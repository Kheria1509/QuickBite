import { v2 as cloudinary } from 'cloudinary';

// Debug Cloudinary environment variables
console.log('Cloudinary Config Debug:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
});

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME environment variable is required');
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('CLOUDINARY_API_KEY environment variable is required');
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY_API_SECRET environment variable is required');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'quickbite-foods', // Organize uploads in a folder
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return { success: true, message: 'Image deleted successfully' };
    } else if (result.result === 'not found') {
      return { success: false, message: 'Image not found' };
    } else {
      return { success: false, message: 'Failed to delete image' };
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export default cloudinary;
