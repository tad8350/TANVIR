import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CloudinaryService } from '../services/cloudinary.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

export interface ImageUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

@ApiTags('Image Upload')
@Controller('image-upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImageUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('product')
  @Roles('admin', 'brand')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
        folder: {
          type: 'string',
          description: 'Custom folder path (optional)',
          example: 'fashion-ecommerce/products',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: Object,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ): Promise<ImageUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadOptions = {
      folder: folder || 'fashion-ecommerce/products',
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
      },
    };

    const result = await this.cloudinaryService.uploadImage(file.buffer, uploadOptions);
    return result;
  }

  @Post('brand-logo')
  @Roles('admin', 'brand')
  @ApiOperation({ summary: 'Upload brand logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Brand logo file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logo uploaded successfully',
    type: Object,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBrandLogo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadOptions = {
      folder: 'fashion-ecommerce/brands/logos',
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
      },
    };

    const result = await this.cloudinaryService.uploadImage(file.buffer, uploadOptions);
    return result;
  }

  @Post('brand-banner')
  @Roles('admin', 'brand')
  @ApiOperation({ summary: 'Upload brand banner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Brand banner file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Banner uploaded successfully',
    type: Object,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBrandBanner(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadOptions = {
      folder: 'fashion-ecommerce/brands/banners',
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
        width: 1200,
        height: 400,
        crop: 'fill',
      },
    };

    const result = await this.cloudinaryService.uploadImage(file.buffer, uploadOptions);
    return result;
  }

  @Post('delete')
  @Roles('admin', 'brand')
  @ApiOperation({ summary: 'Delete image from Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        public_id: {
          type: 'string',
          description: 'Cloudinary public ID of the image to delete',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async deleteImage(@Body('public_id') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    const success = await this.cloudinaryService.deleteImage(publicId);
    return {
      success,
      message: success ? 'Image deleted successfully' : 'Failed to delete image',
    };
  }
}
