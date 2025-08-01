import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto, FavoriteResponseDto } from './dto/favorite.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiQuery({ name: 'user_id', required: true, description: 'User ID', example: 1 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of favorites', type: [FavoriteResponseDto] })
  async findAll(
    @Query('user_id') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.favoritesService.findAll(userId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Add to favorites' })
  @ApiResponse({ status: 201, description: 'Added to favorites successfully', type: FavoriteResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove from favorites' })
  @ApiParam({ name: 'id', description: 'Favorite ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Removed from favorites successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async remove(@Param('id') id: number) {
    return this.favoritesService.remove(id);
  }

  @Delete('user/:userId/product/:productVariantId')
  @ApiOperation({ summary: 'Remove specific product from favorites' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 1 })
  @ApiParam({ name: 'productVariantId', description: 'Product variant ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Removed from favorites successfully' })
  async removeByProduct(@Param('userId') userId: number, @Param('productVariantId') productVariantId: number) {
    return this.favoritesService.removeByProduct(userId, productVariantId);
  }
} 