import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any;
  public_id?: string;
  overwrite?: boolean;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // Configuration is handled in cloudinary.config.ts
  }

  /**
   * Upload image from buffer
   */
  async uploadImage(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const defaultOptions = {
        folder: 'fashion-ecommerce',
        transformation: {
          quality: 'auto',
          fetch_format: 'auto',
        },
        overwrite: true,
        ...options,
      };

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          defaultOptions,
          (error, result) => {
            if (error) {
              this.logger.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );

        // Convert buffer to stream
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Upload image from base64 string
   */
  async uploadBase64Image(
    base64String: string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const defaultOptions = {
        folder: 'fashion-ecommerce',
        transformation: {
          quality: 'auto',
          fetch_format: 'auto',
        },
        overwrite: true,
        ...options,
      };

      const result = await cloudinary.uploader.upload(base64String, defaultOptions);
      return result as CloudinaryUploadResult;
    } catch (error) {
      this.logger.error('Error uploading base64 image to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Delete image by public_id
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Image deleted: ${publicId}`);
      return result.result === 'ok';
    } catch (error) {
      this.logger.error(`Error deleting image ${publicId}:`, error);
      throw error;
    }
  }

  /**
   * Get optimized URL with transformations
   */
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const transformation = {
      width: options.width,
      height: options.height,
      crop: options.crop || 'fill',
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
    };

    return cloudinary.url(publicId, { transformation });
  }

  /**
   * Get product image URL with optimizations
   */
  getProductImageUrl(publicId: string, size: 'thumb' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      thumb: { width: 150, height: 150, crop: 'fill' },
      medium: { width: 400, height: 400, crop: 'fill' },
      large: { width: 800, height: 800, crop: 'fill' },
    };

    return cloudinary.url(publicId, { transformation: sizes[size] });
  }

  /**
   * Get brand logo URL with optimizations
   */
  getBrandLogoUrl(publicId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: { width: 100, height: 100, crop: 'fill' },
      medium: { width: 200, height: 200, crop: 'fill' },
      large: { width: 400, height: 400, crop: 'fill' },
    };

    return cloudinary.url(publicId, { transformation: sizes[size] });
  }

  /**
   * Get brand banner URL with optimizations
   */
  getBrandBannerUrl(publicId: string, width: number = 1200): string {
    return cloudinary.url(publicId, {
      transformation: {
        width,
        height: Math.round(width * 0.3), // 3:1 aspect ratio
        crop: 'fill',
        quality: 'auto',
      },
    });
  }
}
