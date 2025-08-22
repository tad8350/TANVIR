import { IsOptional, IsString, IsNumber, IsArray, Min, Max, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SearchType {
  EXACT = 'exact',
  FUZZY = 'fuzzy',
  FULL_TEXT = 'full_text'
}

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string', example: 'nike shoes' })
  @IsString()
  query: string;

  @ApiProperty({ description: 'Search type', enum: SearchType, default: SearchType.FULL_TEXT })
  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType = SearchType.FULL_TEXT;

  @ApiProperty({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Category ID filter', example: 1 })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ description: 'Brand ID filter', example: 1 })
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @ApiProperty({ description: 'Minimum price filter', example: 10.00 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiProperty({ description: 'Maximum price filter', example: 100.00 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @ApiProperty({ description: 'Status filter', example: 'active', default: 'active' })
  @IsOptional()
  @IsString()
  status?: string = 'active';

  @ApiProperty({ description: 'Sort by field', example: 'relevance', default: 'relevance' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'relevance';

  @ApiProperty({ description: 'Sort order', example: 'desc', default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ description: 'Include inactive products', example: false, default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeInactive?: boolean = false;
}

export class SearchSuggestionDto {
  @ApiProperty({ description: 'Partial search query', example: 'nik' })
  @IsString()
  query: string;

  @ApiProperty({ description: 'Maximum number of suggestions', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class SearchFilterDto {
  @ApiProperty({ description: 'Category IDs to filter by', example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoryIds?: number[];

  @ApiProperty({ description: 'Brand IDs to filter by', example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  brandIds?: number[];

  @ApiProperty({ description: 'Price range filter', example: { min: 10, max: 100 } })
  @IsOptional()
  priceRange?: {
    min?: number;
    max?: number;
  };

  @ApiProperty({ description: 'Tags to filter by', example: ['sports', 'casual'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Availability filter', example: 'in_stock' })
  @IsOptional()
  @IsString()
  availability?: 'in_stock' | 'out_of_stock' | 'all';
}

export class SearchResultDto {
  @ApiProperty({ description: 'Product ID' })
  id: number;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product title' })
  title: string;

  @ApiProperty({ description: 'Brand name' })
  brandName: string;

  @ApiProperty({ description: 'Category name' })
  categoryName: string;

  @ApiProperty({ description: 'Product price' })
  price: number;

  @ApiProperty({ description: 'Sale price' })
  salePrice: number;

  @ApiProperty({ description: 'Search relevance score' })
  relevanceScore: number;

  @ApiProperty({ description: 'Search rank' })
  searchRank: number;

  @ApiProperty({ description: 'Product SKU' })
  sku: string;

  @ApiProperty({ description: 'Product tags' })
  tags: string[];

  @ApiProperty({ description: 'Product status' })
  status: string;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'Search results', type: [SearchResultDto] })
  data: SearchResultDto[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    query: string;
    searchType: SearchType;
    executionTime: number;
  };

  @ApiProperty({ description: 'Search filters applied' })
  filters: SearchFilterDto;

  @ApiProperty({ description: 'Search suggestions for similar queries' })
  suggestions: string[];
}

export class SearchSuggestionResultDto {
  @ApiProperty({ description: 'Suggestion text' })
  suggestion: string;

  @ApiProperty({ description: 'Suggestion type', example: 'product' })
  suggestionType: 'product' | 'brand' | 'category' | 'tag';

  @ApiProperty({ description: 'Relevance score', example: 0.85 })
  relevanceScore: number;
}

export class SearchAnalyticsDto {
  @ApiProperty({ description: 'Search query' })
  query: string;

  @ApiProperty({ description: 'Number of times searched' })
  searchCount: number;

  @ApiProperty({ description: 'Average results count' })
  avgResultsCount: number;

  @ApiProperty({ description: 'Last searched timestamp' })
  lastSearched: Date;
}
