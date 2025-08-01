import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantDto, UpdateProductVariantDto } from './dto/product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, productId?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (productId) {
      where.product = { id: productId };
    }
    
    const [variants, total] = await this.productVariantRepository.findAndCount({
      where,
      relations: ['product', 'color', 'size'],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data: variants,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const variant = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product', 'color', 'size'],
    });
    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }
    return variant;
  }

  async create(createProductVariantDto: CreateProductVariantDto) {
    const variant = this.productVariantRepository.create({
      product: { id: createProductVariantDto.product_id },
      color: { id: createProductVariantDto.color_id },
      size: { id: createProductVariantDto.size_id },
      stock: createProductVariantDto.stock,
      price: createProductVariantDto.price,
      discount_price: createProductVariantDto.discount_price,
      sku: createProductVariantDto.sku,
    });
    return this.productVariantRepository.save(variant);
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    const variant = await this.findOne(id);
    
    if (updateProductVariantDto.color_id) {
      variant.color = { id: updateProductVariantDto.color_id } as any;
    }
    if (updateProductVariantDto.size_id) {
      variant.size = { id: updateProductVariantDto.size_id } as any;
    }
    
    Object.assign(variant, updateProductVariantDto);
    return this.productVariantRepository.save(variant);
  }

  async remove(id: number) {
    const variant = await this.findOne(id);
    await this.productVariantRepository.remove(variant);
    return { message: 'Product variant deleted successfully' };
  }
} 