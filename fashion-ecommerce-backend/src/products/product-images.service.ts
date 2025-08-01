import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto, UpdateProductImageDto } from './dto/product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async findAll(productId?: number) {
    const where: any = {};
    if (productId) {
      where.product = { id: productId };
    }
    
    return this.productImageRepository.find({
      where,
      relations: ['product'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const image = await this.productImageRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!image) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }
    return image;
  }

  async create(createProductImageDto: CreateProductImageDto) {
    const image = this.productImageRepository.create({
      product: { id: createProductImageDto.product_id },
      url: createProductImageDto.url,
    });
    return this.productImageRepository.save(image);
  }

  async update(id: number, updateProductImageDto: UpdateProductImageDto) {
    const image = await this.findOne(id);
    Object.assign(image, updateProductImageDto);
    return this.productImageRepository.save(image);
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    await this.productImageRepository.remove(image);
    return { message: 'Product image deleted successfully' };
  }
} 