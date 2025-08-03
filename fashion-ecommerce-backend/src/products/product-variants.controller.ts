import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto, UpdateProductVariantDto, ProductVariantResponseDto } from './dto/product-variant.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all product variants' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'product_id', required: false, description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of product variants', type: [ProductVariantResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('product_id') productId?: number,
  ) {
    return this.productVariantsService.findAll(page, limit, productId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product variant by ID' })
  @ApiParam({ name: 'id', description: 'Product variant ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product variant details', type: ProductVariantResponseDto })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async findOne(@Param('id') id: number) {
    return this.productVariantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({ status: 201, description: 'Product variant created successfully', type: ProductVariantResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantsService.create(createProductVariantDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product variant' })
  @ApiParam({ name: 'id', description: 'Product variant ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product variant updated successfully', type: ProductVariantResponseDto })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async update(@Param('id') id: number, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantsService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product variant' })
  @ApiParam({ name: 'id', description: 'Product variant ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  async remove(@Param('id') id: number) {
    return this.productVariantsService.remove(id);
  }
} 