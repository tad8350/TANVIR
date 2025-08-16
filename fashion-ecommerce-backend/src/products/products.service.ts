import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { ProductImage } from './entities/product-image.entity';
import { BrandProfile } from '../users/entities/brand-profile.entity';
import { CreateProductDto, UpdateProductDto, ColorBlockDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(BrandProfile)
    private brandRepository: Repository<BrandProfile>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    const where: any = { status: 'active' }; // Default status filter
    
    if (filters.search) {
      where.name = Like(`%${filters.search}%`);
    }
    if (filters.categoryId) {
      where.category_id = filters.categoryId;
    }
    if (filters.brandId) {
      where.brand_id = filters.brandId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    
    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['brand', 'categoryRelation', 'variants', 'variants.color', 'variants.size', 'images'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      select: [
        'id', 'name', 'title', 'description', 'shortDescription', 'price', 'salePrice', 'costPrice',
        'barcode', 'category_id', 'categoryLevel1', 'categoryLevel2', 'categoryLevel3', 'categoryLevel4',
        'category', 'status', 'is_active', 'lowStockThreshold', 'metaTitle', 'metaDescription',
        'keywords', 'tags', 'shippingWeight', 'shippingLength', 'shippingWidth', 'shippingHeight',
        'freeShipping', 'shippingClass', 'taxClass', 'taxRate', 'trackInventory', 'allowBackorders',
        'maxOrderQuantity', 'minOrderQuantity', 'isVirtual', 'isDownloadable', 'downloadLimit',
        'downloadExpiry', 'hasVariants', 'variantType', 'created_at', 'updated_at'
      ]
    });

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'categoryRelation', 'variants', 'variants.color', 'variants.size', 'images'],
      select: [
        'id', 'name', 'title', 'description', 'shortDescription', 'price', 'salePrice', 'costPrice',
        'barcode', 'category_id', 'categoryLevel1', 'categoryLevel2', 'categoryLevel3', 'categoryLevel4',
        'category', 'status', 'is_active', 'lowStockThreshold', 'metaTitle', 'metaDescription',
        'keywords', 'tags', 'shippingWeight', 'shippingLength', 'shippingWidth', 'shippingHeight',
        'freeShipping', 'shippingClass', 'taxClass', 'taxRate', 'trackInventory', 'allowBackorders',
        'maxOrderQuantity', 'minOrderQuantity', 'isVirtual', 'isDownloadable', 'downloadLimit',
        'downloadExpiry', 'hasVariants', 'variantType', 'created_at', 'updated_at'
      ]
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, user?: any) {
    // Validate user role if provided
    if (user && !['admin', 'super_admin', 'brand'].includes(user.user_type)) {
      throw new ForbiddenException('Only admins and brands can create products');
    }

    // Extract data from DTO
    const { 
      colorBlocks, 
      images, 
      brand, 
      category,
      price,
      salePrice,
      costPrice,
      lowStockThreshold,
      maxOrderQuantity,
      minOrderQuantity,
      downloadLimit,
      downloadExpiry,
      taxRate,
      shippingWeight,
      shippingDimensions,
      ...productData 
    } = createProductDto;

    // Handle brand - find by name and get ID
    let brandId: number | undefined;
    if (brand) {
      const brandProfile = await this.brandRepository.findOne({
        where: { brand_name: brand }
      });
      if (brandProfile) {
        brandId = brandProfile.id;
      } else {
        throw new BadRequestException(`Brand '${brand}' not found. Please create the brand first.`);
      }
    }

    // Create product with proper type conversion and null handling
    const product = this.productRepository.create({
      ...productData,
      brand_id: brandId, // Set the brand_id
      price: price ? parseFloat(price) : undefined,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
      maxOrderQuantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : undefined,
      minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 1,
      downloadLimit: downloadLimit ? parseInt(downloadLimit) : undefined,
      downloadExpiry: downloadExpiry ? parseInt(downloadExpiry) : undefined,
      taxRate: taxRate ? parseFloat(taxRate) : undefined,
      shippingWeight: shippingWeight ? parseFloat(shippingWeight) : undefined,
      shippingLength: shippingDimensions?.length ? parseFloat(shippingDimensions.length) : undefined,
      shippingWidth: shippingDimensions?.width ? parseFloat(shippingDimensions.width) : undefined,
      shippingHeight: shippingDimensions?.height ? parseFloat(shippingDimensions.height) : undefined,
      tags: this.processTags(productData.tags),
    });

    // Save the product
    const savedProduct = await this.productRepository.save(product);

    // Handle color blocks and create variants
    if (colorBlocks && colorBlocks.length > 0) {
      await this.handleColorBlocks(savedProduct, colorBlocks);
    }

    // Handle product images
    if (images && images.length > 0) {
      await this.handleProductImages(savedProduct, images);
    }

    // Return the complete product with relations
    return this.findOne(savedProduct.id);
  }

  private async handleColorBlocks(product: Product, colorBlocks: ColorBlockDto[]) {
    for (const colorBlock of colorBlocks) {
      // Skip if color is not provided
      if (!colorBlock.color) continue;

      // Find or create color
      let color = await this.colorRepository.findOne({
        where: { name: colorBlock.color }
      });

      if (!color) {
        color = await this.colorRepository.save({
          name: colorBlock.color
        });
      }

      // Handle sizes and create variants
      if (colorBlock.sizes && colorBlock.sizes.length > 0) {
        for (const sizeData of colorBlock.sizes) {
          // Skip if size is not provided
          if (!sizeData.size) continue;

          // Find or create size
          let size = await this.sizeRepository.findOne({
            where: { name: sizeData.size }
          });

          if (!size) {
            size = await this.sizeRepository.save({
              name: sizeData.size
            });
          }

          // Create product variant with size-level pricing
          const variant = this.productVariantRepository.create({
            product_id: product.id,
            color_id: color.id,
            size_id: size.id,
            stock: parseInt(sizeData.quantity || '0'),
            lowStockThreshold: sizeData.lowStockThreshold ? parseInt(sizeData.lowStockThreshold) : undefined,
            price: sizeData.basePrice ? parseFloat(sizeData.basePrice) : product.price,
            discount_price: sizeData.salePrice ? parseFloat(sizeData.salePrice) : product.salePrice,
            sku: `${product.sku}-${color.name}-${size.name}`.toUpperCase().replace(/\s+/g, '-'),
          });

          await this.productVariantRepository.save(variant);
        }
      }
    }
  }

  private async handleProductImages(product: Product, images: string[]) {
    for (const imageUrl of images) {
      const productImage = this.productImageRepository.create({
        product_id: product.id,
        url: imageUrl
      });

      await this.productImageRepository.save(productImage);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    
    // Extract data from DTO
    const { 
      colorBlocks, 
      images, 
      brand, 
      category,
      price,
      salePrice,
      costPrice,
      lowStockThreshold,
      maxOrderQuantity,
      minOrderQuantity,
      downloadLimit,
      downloadExpiry,
      taxRate,
      shippingWeight,
      shippingDimensions,
      ...productData 
    } = updateProductDto;

    // Convert string values to numbers where needed
    const updateData = {
      ...productData,
      price: price ? parseFloat(price) : product.price,
      salePrice: salePrice ? parseFloat(salePrice) : product.salePrice,
      costPrice: costPrice ? parseFloat(costPrice) : product.costPrice,
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : product.lowStockThreshold,
      maxOrderQuantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : product.maxOrderQuantity,
      minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : product.minOrderQuantity,
      downloadLimit: downloadLimit ? parseInt(downloadLimit) : product.downloadLimit,
      downloadExpiry: downloadExpiry ? parseInt(downloadExpiry) : product.downloadExpiry,
      taxRate: taxRate ? parseFloat(taxRate) : product.taxRate,
      shippingWeight: shippingWeight ? parseFloat(shippingWeight) : product.shippingWeight,
      shippingLength: shippingDimensions?.length ? parseFloat(shippingDimensions.length) : product.shippingLength,
      shippingWidth: shippingDimensions?.width ? parseFloat(shippingDimensions.width) : product.shippingWidth,
      shippingHeight: shippingDimensions?.height ? parseFloat(shippingDimensions.height) : product.shippingHeight,
      tags: productData.tags ? (typeof productData.tags === 'string' ? (productData.tags as string).split(',').map(tag => tag.trim()) : productData.tags) : product.tags,
    };

    Object.assign(product, updateData);
    const savedProduct = await this.productRepository.save(product);

    // Handle color blocks update if provided
    if (colorBlocks && colorBlocks.length > 0) {
      // Remove existing variants for this product
      await this.productVariantRepository.delete({ product_id: product.id });
      // Create new variants
      await this.handleColorBlocks(savedProduct, colorBlocks);
    }

    // Handle product images update if provided
    if (images && images.length > 0) {
      // Remove existing images for this product
      await this.productImageRepository.delete({ product_id: product.id });
      // Create new images
      await this.handleProductImages(savedProduct, images);
    }

    return this.findOne(savedProduct.id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    
    // Remove related variants and images first
    await this.productVariantRepository.delete({ product_id: id });
    await this.productImageRepository.delete({ product_id: id });
    
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  // Helper method to get brands for dropdown
  async getBrands() {
    // This would typically come from a brands service
    // For now, return a mock list
    return [
      'Fashion Forward',
      'TechGear Pro',
      'Home & Garden Co',
      'Sports Elite',
      'Beauty Plus',
      'Urban Style',
      'Classic Collection',
      'Premium Brands',
      'Sportswear Pro',
      'Casual Comfort'
    ];
  }

  // Helper method to get colors for dropdown
  async getColors() {
    const colors = await this.colorRepository.find();
    return colors.map(color => color.name);
  }

  // Helper method to get sizes for dropdown
  async getSizes() {
    const sizes = await this.sizeRepository.find();
    return sizes.map(size => size.name);
  }

  private processTags(tags: string | string[] | undefined): string[] {
    if (!tags) return [];
    
    if (typeof tags === 'string') {
      // Handle comma-separated string
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    if (Array.isArray(tags)) {
      // Handle array of strings
      return tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
    }
    
    return [];
  }
} 