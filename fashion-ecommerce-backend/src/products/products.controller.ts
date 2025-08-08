import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto/product.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AppAuthGuard } from '../auth/guards/app-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOrBrand } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', example: 'nike' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Category ID', example: 1 })
  @ApiQuery({ name: 'brand_id', required: false, description: 'Brand ID', example: 1 })
  @ApiQuery({ name: 'status', required: false, description: 'Product status', example: 'active' })
  @ApiResponse({ status: 200, description: 'List of products', type: [ProductResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('category_id') categoryId?: number,
    @Query('brand_id') brandId?: number,
    @Query('status') status?: string,
  ) {
    return this.productsService.findAll(page, limit, { search, categoryId, brandId, status });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product details', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AppAuthGuard, RolesGuard)
  @AdminOrBrand()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product (Admin or Brand only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(createProductDto, user);
  }

  @Put(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @AdminOrBrand()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product (Admin or Brand only)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AppAuthGuard, RolesGuard)
  @AdminOrBrand()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete product (Admin or Brand only)' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @Get('brands/list')
  @Public()
  @ApiOperation({ summary: 'Get all brands for dropdown' })
  @ApiResponse({ status: 200, description: 'List of brands', type: [String] })
  async getBrands() {
    return this.productsService.getBrands();
  }

  @Get('colors/list')
  @Public()
  @ApiOperation({ summary: 'Get all colors for dropdown' })
  @ApiResponse({ status: 200, description: 'List of colors', type: [String] })
  async getColors() {
    return this.productsService.getColors();
  }

  @Get('sizes/list')
  @Public()
  @ApiOperation({ summary: 'Get all sizes for dropdown' })
  @ApiResponse({ status: 200, description: 'List of sizes', type: [String] })
  async getSizes() {
    return this.productsService.getSizes();
  }
}