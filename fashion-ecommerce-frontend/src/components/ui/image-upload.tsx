'use client';

import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { toast } from 'sonner';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { CldImage } from 'next-cloudinary';

interface ImageUploadProps {
  onImageUpload: (result: {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
  }) => void;
  folder?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  preview?: boolean;
  currentImage?: string;
  currentPublicId?: string;
}

export function ImageUpload({
  onImageUpload,
  folder = 'fashion-ecommerce',
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className = '',
  preview = true,
  currentImage,
  currentPublicId,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setIsUploading(true);
      const result = await uploadImageToCloudinary(file, folder);
      
      onImageUpload(result);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // You might want to call a callback to handle image removal
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <div className="mt-1 flex items-center space-x-4">
          <Input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={isUploading}
            className="flex-1"
          />
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Remove
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Maximum file size: {maxSize}MB. Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      {preview && previewUrl && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Preview</Label>
          <div className="relative inline-block">
            {currentPublicId ? (
              <CldImage
                src={currentPublicId}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg border border-gray-300"
                crop="fill"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-48 w-48 rounded-lg border border-gray-300 object-cover"
              />
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
