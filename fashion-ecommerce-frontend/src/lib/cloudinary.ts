import { CldImage } from 'next-cloudinary';

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dgrmlche4',
  uploadPreset: 'fashion-ecommerce', // You'll need to create this in your Cloudinary dashboard
};

// Image upload function
export const uploadImageToCloudinary = async (
  file: File,
  folder: string = 'fashion-ecommerce'
): Promise<{
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Product image upload
export const uploadProductImage = async (file: File) => {
  return uploadImageToCloudinary(file, 'fashion-ecommerce/products');
};

// Brand logo upload
export const uploadBrandLogo = async (file: File) => {
  return uploadImageToCloudinary(file, 'fashion-ecommerce/brands/logos');
};

// Brand banner upload
export const uploadBrandBanner = async (file: File) => {
  return uploadImageToCloudinary(file, 'fashion-ecommerce/brands/banners');
};

// Get optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
) => {
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.crop) params.append('c', options.crop);
  if (options.quality) params.append('q', options.quality);
  if (options.format) params.append('f', options.format);

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const queryString = params.toString();
  
  return queryString ? `${baseUrl}/${publicId}?${queryString}` : `${baseUrl}/${publicId}`;
};

// Get product image URL with size
export const getProductImageUrl = (
  publicId: string,
  size: 'thumb' | 'medium' | 'large' = 'medium'
) => {
  const sizes = {
    thumb: { width: 150, height: 150, crop: 'fill' },
    medium: { width: 400, height: 400, crop: 'fill' },
    large: { width: 800, height: 800, crop: 'fill' },
  };

  return getOptimizedImageUrl(publicId, sizes[size]);
};

// Get brand logo URL with size
export const getBrandLogoUrl = (
  publicId: string,
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const sizes = {
    small: { width: 100, height: 100, crop: 'fill' },
    medium: { width: 200, height: 200, crop: 'fill' },
    large: { width: 400, height: 400, crop: 'fill' },
  };

  return getOptimizedImageUrl(publicId, sizes[size]);
};

// Get brand banner URL
export const getBrandBannerUrl = (publicId: string, width: number = 1200) => {
  return getOptimizedImageUrl(publicId, {
    width,
    height: Math.round(width * 0.3), // 3:1 aspect ratio
    crop: 'fill',
    quality: 'auto',
  });
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Export CldImage component for use in components
export { CldImage };
