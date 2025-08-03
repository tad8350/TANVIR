import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto, UpdateProductImageDto, ProductImageResponseDto } from './dto/product-image.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all product images' })
  @ApiQuery({ name: 'product_id', required: false, description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of product images', type: [ProductImageResponseDto] })
  async findAll(@Query('product_id') productId?: number) {
    return this.productImagesService.findAll(productId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product image by ID' })
  @ApiParam({ name: 'id', description: 'Product image ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product image details', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Product image not found' })
  async findOne(@Param('id') id: number) {
    return this.productImagesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product image' })
  @ApiResponse({ status: 201, description: 'Product image created successfully', type: ProductImageResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImagesService.create(createProductImageDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product image' })
  @ApiParam({ name: 'id', description: 'Product image ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product image updated successfully', type: ProductImageResponseDto })
  @ApiResponse({ status: 404, description: 'Product image not found' })
  async update(@Param('id') id: number, @Body() updateProductImageDto: UpdateProductImageDto) {
    return this.productImagesService.update(id, updateProductImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({ name: 'id', description: 'Product image ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product image not found' })
  async remove(@Param('id') id: number) {
    return this.productImagesService.remove(id);
  }
} 