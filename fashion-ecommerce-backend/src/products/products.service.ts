import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (filters.search) {
      where.name = Like(`%${filters.search}%`);
    }
    if (filters.categoryId) {
      where.category = { id: filters.categoryId };
    }
    if (filters.brandId) {
      where.brand = { id: filters.brandId };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    
    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['brand', 'category', 'variants', 'images'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
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
      relations: ['brand', 'category', 'variants', 'images'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const { images, ...productData } = createProductDto;
    const product = this.productRepository.create({
      ...productData,
      brand: { id: createProductDto.brand_id },
      category: { id: createProductDto.category_id },
    });
    
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    
    if (updateProductDto.brand_id) {
      product.brand = { id: updateProductDto.brand_id } as any;
    }
    if (updateProductDto.category_id) {
      product.category = { id: updateProductDto.category_id } as any;
    }
    
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
} 