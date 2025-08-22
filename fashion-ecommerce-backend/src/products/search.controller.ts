import { Controller, Get, Post, Query, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { 
  SearchQueryDto, 
  SearchResponseDto, 
  SearchSuggestionDto, 
  SearchSuggestionResultDto,
  SearchAnalyticsDto,
  SearchType
} from './dto/search.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('products')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Search products with advanced filtering and ranking',
    description: 'Search products using PostgreSQL Full-Text Search (FTS), trigram similarity, or exact matching with comprehensive filtering options.'
  })
  @ApiBody({ type: SearchQueryDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results with pagination and metadata',
    type: SearchResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @ApiResponse({ status: 500, description: 'Search operation failed' })
  async searchProducts(
    @Body() searchQuery: SearchQueryDto,
    @Request() req?: any
  ): Promise<SearchResponseDto> {
    const userId = req?.user?.id;
    return this.searchService.searchProducts(searchQuery, userId);
  }

  @Get('products')
  @Public()
  @ApiOperation({ 
    summary: 'Search products via GET request',
    description: 'Alternative GET endpoint for product search with query parameters'
  })
  @ApiQuery({ name: 'query', required: true, description: 'Search query string', example: 'nike shoes' })
  @ApiQuery({ name: 'type', required: false, description: 'Search type', enum: ['exact', 'fuzzy', 'full_text'], example: 'full_text' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Category ID filter', example: 1 })
  @ApiQuery({ name: 'brandId', required: false, description: 'Brand ID filter', example: 1 })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter', example: 10.00 })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter', example: 100.00 })
  @ApiQuery({ name: 'status', required: false, description: 'Product status filter', example: 'active' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', example: 'relevance' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', example: 'desc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results with pagination and metadata',
    type: SearchResponseDto 
  })
  async searchProductsGet(
    @Query('query') query: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Request() req?: any
  ): Promise<SearchResponseDto> {
    const searchQuery: SearchQueryDto = {
      query,
      type: type as SearchType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      brandId: brandId ? parseInt(brandId) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status: status || 'active',
      sortBy: sortBy || 'relevance',
      sortOrder: sortOrder || 'desc',
    };

    const userId = req?.user?.id;
    return this.searchService.searchProducts(searchQuery, userId);
  }

  @Get('suggestions')
  @Public()
  @ApiOperation({ 
    summary: 'Get search suggestions for autocomplete',
    description: 'Get search suggestions based on partial query input using trigram similarity'
  })
  @ApiQuery({ name: 'query', required: true, description: 'Partial search query', example: 'nik' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of suggestions', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'List of search suggestions',
    type: [String]
  })
  async getSearchSuggestions(
    @Query('query') query: string,
    @Query('limit') limit?: string
  ): Promise<string[]> {
    return this.searchService.getSearchSuggestions(query, limit ? parseInt(limit) : 10);
  }

  @Post('suggestions')
  @Public()
  @ApiOperation({ 
    summary: 'Get detailed search suggestions with types',
    description: 'Get search suggestions with type information (product, brand, category, tag) and relevance scores'
  })
  @ApiBody({ type: SearchSuggestionDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed search suggestions with types and scores',
    type: [SearchSuggestionResultDto]
  })
  async getDetailedSearchSuggestions(
    @Body() suggestionQuery: SearchSuggestionDto
  ): Promise<SearchSuggestionResultDto[]> {
    return this.searchService.getDetailedSearchSuggestions(suggestionQuery);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get search analytics',
    description: 'Get search analytics including popular queries, search counts, and average results (Admin only)'
  })
  @ApiQuery({ name: 'daysBack', required: false, description: 'Number of days to look back', example: 30 })
  @ApiResponse({ 
    status: 200, 
    description: 'Search analytics data',
    type: [SearchAnalyticsDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getSearchAnalytics(
    @Query('daysBack') daysBack?: string
  ): Promise<SearchAnalyticsDto[]> {
    return this.searchService.getSearchAnalytics(daysBack ? parseInt(daysBack) : 30);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Refresh search table',
    description: 'Manually refresh the denormalized search table (Admin only)'
  })
  @ApiResponse({ status: 200, description: 'Search table refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 500, description: 'Failed to refresh search table' })
  async refreshSearchTable(): Promise<{ message: string }> {
    await this.searchService.refreshSearchTable();
    return { message: 'Search table refreshed successfully' };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get search table statistics',
    description: 'Get statistics about the search table including product counts and index size (Admin only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Search table statistics',
    schema: {
      type: 'object',
      properties: {
        totalProducts: { type: 'number', example: 1500 },
        activeProducts: { type: 'number', example: 1200 },
        lastUpdated: { type: 'string', format: 'date-time' },
        indexSize: { type: 'string', example: '2.5 MB' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getSearchTableStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lastUpdated: Date;
    indexSize: string;
  }> {
    return this.searchService.getSearchTableStats();
  }

  @Get('health')
  @Public()
  @ApiOperation({ 
    summary: 'Search service health check',
    description: 'Check if the search service is working properly'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Search service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', format: 'date-time' },
        service: { type: 'string', example: 'search-service' }
      }
    }
  })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'search-service'
    };
  }
}
