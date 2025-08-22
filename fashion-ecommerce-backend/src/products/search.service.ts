import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductSearch } from './entities/product-search.entity';
import { SearchLog } from '../analytics/entities/search-log.entity';
import { 
  SearchQueryDto, 
  SearchResponseDto, 
  SearchResultDto, 
  SearchSuggestionDto, 
  SearchSuggestionResultDto,
  SearchAnalyticsDto,
  SearchType 
} from './dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(ProductSearch)
    private productSearchRepository: Repository<ProductSearch>,
    @InjectRepository(SearchLog)
    private searchLogRepository: Repository<SearchLog>,
    private dataSource: DataSource,
  ) {}

  /**
   * Advanced product search using PostgreSQL FTS and trigram similarity
   */
  async searchProducts(searchQuery: SearchQueryDto, userId?: number): Promise<SearchResponseDto> {
    const startTime = Date.now();
    
    try {
      let results: SearchResultDto[] = [];
      let total = 0;

      switch (searchQuery.type) {
        case SearchType.EXACT:
          results = await this.exactSearch(searchQuery);
          break;
        case SearchType.FUZZY:
          results = await this.fuzzySearch(searchQuery);
          break;
        case SearchType.FULL_TEXT:
        default:
          results = await this.fullTextSearch(searchQuery);
          break;
      }

      // Get total count for pagination
      total = await this.getTotalCount(searchQuery);

      // Get search suggestions
      const suggestions = await this.getSearchSuggestions(searchQuery.query, 5);

      // Log search query
      if (userId) {
        await this.logSearchQuery(userId, searchQuery.query, results.length);
      }

      const executionTime = Date.now() - startTime;

      return {
        data: results,
        meta: {
          page: searchQuery.page ?? 1,
          limit: searchQuery.limit ?? 20,
          total,
          totalPages: Math.ceil(total / (searchQuery.limit ?? 20)),
          query: searchQuery.query,
          searchType: searchQuery.type ?? SearchType.FULL_TEXT,
          executionTime,
        },
        filters: {
          categoryIds: searchQuery.categoryId ? [searchQuery.categoryId] : undefined,
          brandIds: searchQuery.brandId ? [searchQuery.brandId] : undefined,
          priceRange: searchQuery.minPrice || searchQuery.maxPrice ? {
            min: searchQuery.minPrice ?? undefined,
            max: searchQuery.maxPrice ?? undefined,
          } : undefined,
          availability: 'all',
        },
        suggestions,
      };
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`, error.stack);
      throw new BadRequestException('Search operation failed');
    }
  }

  /**
   * Full-text search using PostgreSQL FTS with ranking
   */
  private async fullTextSearch(searchQuery: SearchQueryDto): Promise<SearchResultDto[]> {
    const queryBuilder = this.productSearchRepository
      .createQueryBuilder('ps')
      .select([
        'ps.product_id as id',
        'ps.name',
        'ps.title',
        'ps.brand_name as brandName',
        'ps.category_name as categoryName',
        'ps.price',
        'ps.sale_price as salePrice',
        'ps.sku',
        'ps.tags',
        'ps.status',
        'ts_rank(ps.search_document, plainto_tsquery(:query)) as searchRank',
        'CASE ' +
          'WHEN ps.name ILIKE :exactName THEN 1.0 ' +
          'WHEN ps.title ILIKE :exactTitle THEN 0.9 ' +
          'WHEN ps.brand_name ILIKE :exactBrand THEN 0.8 ' +
          'WHEN ps.category_name ILIKE :exactCategory THEN 0.7 ' +
          'WHEN ps.tags::text ILIKE :exactTags THEN 0.6 ' +
          'ELSE 0.5 ' +
        'END as relevanceScore'
      ])
      .where('ps.search_document @@ plainto_tsquery(:query)')
      .andWhere('ps.status = :status')
      .andWhere('ps.is_active = :isActive')
      .setParameter('query', searchQuery.query)
      .setParameter('exactName', `%${searchQuery.query}%`)
      .setParameter('exactTitle', `%${searchQuery.query}%`)
      .setParameter('exactBrand', `%${searchQuery.query}%`)
      .setParameter('exactCategory', `%${searchQuery.query}%`)
      .setParameter('exactTags', `%${searchQuery.query}%`)
      .setParameter('status', searchQuery.status)
      .setParameter('isActive', !searchQuery.includeInactive);

    // Apply filters
    if (searchQuery.categoryId) {
      queryBuilder.andWhere('ps.category_id = :categoryId')
        .setParameter('categoryId', searchQuery.categoryId);
    }

    if (searchQuery.brandId) {
      queryBuilder.andWhere('ps.brand_id = :brandId')
        .setParameter('brandId', searchQuery.brandId);
    }

    if (searchQuery.minPrice) {
      queryBuilder.andWhere('ps.price >= :minPrice')
        .setParameter('minPrice', searchQuery.minPrice);
    }

    if (searchQuery.maxPrice) {
      queryBuilder.andWhere('ps.price <= :maxPrice')
        .setParameter('maxPrice', searchQuery.maxPrice);
    }

    // Apply sorting
    if (searchQuery.sortBy === 'price') {
      queryBuilder.orderBy('ps.price', (searchQuery.sortOrder ?? 'desc').toUpperCase() as 'ASC' | 'DESC');
    } else if (searchQuery.sortBy === 'name') {
      queryBuilder.orderBy('ps.name', (searchQuery.sortOrder ?? 'desc').toUpperCase() as 'ASC' | 'DESC');
    } else {
      // Default: relevance-based sorting
      queryBuilder.orderBy('relevanceScore', 'DESC')
        .addOrderBy('searchRank', 'DESC')
        .addOrderBy('ps.updated_at', 'DESC');
    }

    // Apply pagination
    const page = searchQuery.page ?? 1;
    const limit = searchQuery.limit ?? 20;
    const skip = (page - 1) * limit;
    queryBuilder.offset(skip).limit(limit);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults.map(result => ({
      id: result.id,
      name: result.name,
      title: result.title,
      brandName: result.brandname,
      categoryName: result.categoryname,
      price: result.price,
      salePrice: result.saleprice,
      relevanceScore: parseFloat(result.relevancescore),
      searchRank: parseFloat(result.searchrank),
      sku: result.sku,
      tags: result.tags,
      status: result.status,
    }));
  }

  /**
   * Fuzzy search using trigram similarity
   */
  private async fuzzySearch(searchQuery: SearchQueryDto): Promise<SearchResultDto[]> {
    const queryBuilder = this.productSearchRepository
      .createQueryBuilder('ps')
      .select([
        'ps.product_id as id',
        'ps.name',
        'ps.title',
        'ps.brand_name as brandName',
        'ps.category_name as categoryName',
        'ps.price',
        'ps.sale_price as salePrice',
        'ps.sku',
        'ps.tags',
        'ps.status',
        'GREATEST(' +
          'similarity(ps.name, :query), ' +
          'similarity(ps.title, :query), ' +
          'similarity(ps.brand_name, :query), ' +
          'similarity(ps.sku, :query)' +
        ') as similarityScore'
      ])
      .where('(ps.name % :query OR ps.title % :query OR ps.brand_name % :query OR ps.sku % :query)')
      .andWhere('ps.status = :status')
      .andWhere('ps.is_active = :isActive')
      .setParameter('query', searchQuery.query)
      .setParameter('status', searchQuery.status)
      .setParameter('isActive', !searchQuery.includeInactive);

    // Apply filters
    if (searchQuery.categoryId) {
      queryBuilder.andWhere('ps.category_id = :categoryId')
        .setParameter('categoryId', searchQuery.categoryId);
    }

    if (searchQuery.brandId) {
      queryBuilder.andWhere('ps.brand_id = :brandId')
        .setParameter('brandId', searchQuery.brandId);
    }

    if (searchQuery.minPrice) {
      queryBuilder.andWhere('ps.price >= :minPrice')
        .setParameter('minPrice', searchQuery.minPrice);
    }

    if (searchQuery.maxPrice) {
      queryBuilder.andWhere('ps.price <= :maxPrice')
        .setParameter('maxPrice', searchQuery.maxPrice);
    }

    // Order by similarity score
    queryBuilder.orderBy('similarityScore', 'DESC');

    // Apply pagination
    const page = searchQuery.page ?? 1;
    const limit = searchQuery.limit ?? 20;
    const skip = (page - 1) * limit;
    queryBuilder.offset(skip).limit(limit);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults.map(result => ({
      id: result.id,
      name: result.name,
      title: result.title,
      brandName: result.brandname,
      categoryName: result.categoryname,
      price: result.price,
      salePrice: result.saleprice,
      relevanceScore: parseFloat(result.similarityscore),
      searchRank: 0,
      sku: result.sku,
      tags: result.tags,
      status: result.status,
    }));
  }

  /**
   * Exact match search using ILIKE
   */
  private async exactSearch(searchQuery: SearchQueryDto): Promise<SearchResultDto[]> {
    const queryBuilder = this.productSearchRepository
      .createQueryBuilder('ps')
      .select([
        'ps.product_id as id',
        'ps.name',
        'ps.title',
        'ps.brand_name as brandName',
        'ps.category_name as categoryName',
        'ps.price',
        'ps.sale_price as salePrice',
        'ps.sku',
        'ps.tags',
        'ps.status'
      ])
      .where('(ps.name ILIKE :query OR ps.title ILIKE :query OR ps.brand_name ILIKE :query OR ps.sku ILIKE :query)')
      .andWhere('ps.status = :status')
      .andWhere('ps.is_active = :isActive')
      .setParameter('query', `%${searchQuery.query}%`)
      .setParameter('status', searchQuery.status)
      .setParameter('isActive', !searchQuery.includeInactive);

    // Apply filters
    if (searchQuery.categoryId) {
      queryBuilder.andWhere('ps.category_id = :categoryId')
        .setParameter('categoryId', searchQuery.categoryId);
    }

    if (searchQuery.brandId) {
      queryBuilder.andWhere('ps.brand_id = :brandId')
        .setParameter('brandId', searchQuery.brandId);
    }

    if (searchQuery.minPrice) {
      queryBuilder.andWhere('ps.price >= :minPrice')
        .setParameter('minPrice', searchQuery.minPrice);
    }

    if (searchQuery.maxPrice) {
      queryBuilder.andWhere('ps.price <= :maxPrice')
        .setParameter('maxPrice', searchQuery.maxPrice);
    }

    // Order by relevance (exact matches first)
    queryBuilder.orderBy('CASE ' +
      'WHEN ps.name ILIKE :exactName THEN 1 ' +
      'WHEN ps.title ILIKE :exactTitle THEN 2 ' +
      'WHEN ps.brand_name ILIKE :exactBrand THEN 3 ' +
      'WHEN ps.sku ILIKE :exactSku THEN 4 ' +
      'ELSE 5 ' +
      'END', 'ASC')
      .addOrderBy('ps.updated_at', 'DESC')
      .setParameter('exactName', searchQuery.query)
      .setParameter('exactTitle', searchQuery.query)
      .setParameter('exactBrand', searchQuery.query)
      .setParameter('exactSku', searchQuery.query);

    // Apply pagination
    const page = searchQuery.page ?? 1;
    const limit = searchQuery.limit ?? 20;
    const skip = (page - 1) * limit;
    queryBuilder.offset(skip).limit(limit);

    const rawResults = await queryBuilder.getRawMany();

    return rawResults.map(result => ({
      id: result.id,
      name: result.name,
      title: result.title,
      brandName: result.brandname,
      categoryName: result.categoryname,
      price: result.price,
      salePrice: result.saleprice,
      relevanceScore: 1.0, // Exact matches get highest score
      searchRank: 0,
      sku: result.sku,
      tags: result.tags,
      status: result.status,
    }));
  }

  /**
   * Get total count for pagination
   */
  private async getTotalCount(searchQuery: SearchQueryDto): Promise<number> {
    const queryBuilder = this.productSearchRepository
      .createQueryBuilder('ps')
      .select('COUNT(ps.id)', 'count');

    switch (searchQuery.type) {
      case SearchType.EXACT:
        queryBuilder.where('(ps.name ILIKE :query OR ps.title ILIKE :query OR ps.brand_name ILIKE :query OR ps.sku ILIKE :query)')
          .setParameter('query', `%${searchQuery.query}%`);
        break;
      case SearchType.FUZZY:
        queryBuilder.where('(ps.name % :query OR ps.title % :query OR ps.brand_name % :query OR ps.sku % :query)')
          .setParameter('query', searchQuery.query);
        break;
      default:
        queryBuilder.where('ps.search_document @@ plainto_tsquery(:query)')
          .setParameter('query', searchQuery.query);
        break;
    }

    queryBuilder.andWhere('ps.status = :status')
      .andWhere('ps.is_active = :isActive')
      .setParameter('status', searchQuery.status)
      .setParameter('isActive', !searchQuery.includeInactive);

    // Apply filters
    if (searchQuery.categoryId) {
      queryBuilder.andWhere('ps.category_id = :categoryId')
        .setParameter('categoryId', searchQuery.categoryId);
    }

    if (searchQuery.brandId) {
      queryBuilder.andWhere('ps.brand_id = :brandId')
        .setParameter('brandId', searchQuery.brandId);
    }

    if (searchQuery.minPrice) {
      queryBuilder.andWhere('ps.price >= :minPrice')
        .setParameter('minPrice', searchQuery.minPrice);
    }

    if (searchQuery.maxPrice) {
      queryBuilder.andWhere('ps.price <= :maxPrice')
        .setParameter('maxPrice', searchQuery.maxPrice);
    }

    const result = await queryBuilder.getRawOne();
    return parseInt(result.count);
  }

  /**
   * Get search suggestions for autocomplete
   */
  async getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const suggestions = await this.dataSource.query(`
        SELECT DISTINCT suggestion
        FROM (
          SELECT name as suggestion, similarity(name, $1) as score
          FROM product_search
          WHERE name ILIKE $2 AND status = 'active' AND is_active = true
          
          UNION
          
          SELECT title as suggestion, similarity(title, $1) as score
          FROM product_search
          WHERE title ILIKE $2 AND status = 'active' AND is_active = true
          
          UNION
          
          SELECT brand_name as suggestion, similarity(brand_name, $1) as score
          FROM product_search
          WHERE brand_name ILIKE $2 AND status = 'active' AND is_active = true
          
          UNION
          
          SELECT category_name as suggestion, similarity(category_name, $1) as score
          FROM product_search
          WHERE category_name ILIKE $2 AND status = 'active' AND is_active = true
        ) suggestions
        ORDER BY score DESC
        LIMIT $3
      `, [`%${query}%`, `${query}%`, limit]);

      return suggestions.map(s => s.suggestion).filter(Boolean);
    } catch (error) {
      this.logger.error(`Failed to get search suggestions: ${error.message}`);
      return [];
    }
  }

  /**
   * Get detailed search suggestions with types
   */
  async getDetailedSearchSuggestions(suggestionQuery: SearchSuggestionDto): Promise<SearchSuggestionResultDto[]> {
    if (!suggestionQuery.query || suggestionQuery.query.length < 2) {
      return [];
    }

    try {
      const suggestions = await this.dataSource.query(`
        SELECT suggestion, suggestion_type, relevance_score
        FROM get_search_suggestions($1, $2)
        ORDER BY relevance_score DESC
      `, [suggestionQuery.query, suggestionQuery.limit]);

      return suggestions.map(s => ({
        suggestion: s.suggestion,
        suggestionType: s.suggestion_type,
        relevanceScore: parseFloat(s.relevance_score),
      }));
    } catch (error) {
      this.logger.error(`Failed to get detailed search suggestions: ${error.message}`);
      return [];
    }
  }

  /**
   * Log search query for analytics
   */
  private async logSearchQuery(userId: number, query: string, resultsCount: number): Promise<void> {
    try {
      await this.searchLogRepository.save({
        user_id: userId,
        query,
        results_count: resultsCount,
        searched_at: new Date(),
      });
    } catch (error) {
      this.logger.error(`Failed to log search query: ${error.message}`);
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(daysBack: number = 30): Promise<SearchAnalyticsDto[]> {
    try {
      const analytics = await this.dataSource.query(`
        SELECT query, search_count, avg_results_count, last_searched
        FROM get_search_analytics($1)
      `, [daysBack]);

      return analytics.map(a => ({
        query: a.query,
        searchCount: parseInt(a.search_count),
        avgResultsCount: parseFloat(a.avg_results_count),
        lastSearched: new Date(a.last_searched),
      }));
    } catch (error) {
      this.logger.error(`Failed to get search analytics: ${error.message}`);
      return [];
    }
  }

  /**
   * Refresh search table (useful for maintenance)
   */
  async refreshSearchTable(): Promise<void> {
    try {
      await this.dataSource.query('SELECT populate_product_search_table()');
      this.logger.log('Search table refreshed successfully');
    } catch (error) {
      this.logger.error(`Failed to refresh search table: ${error.message}`);
      throw new BadRequestException('Failed to refresh search table');
    }
  }

  /**
   * Get search table statistics
   */
  async getSearchTableStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lastUpdated: Date;
    indexSize: string;
  }> {
    try {
      const stats = await this.dataSource.query(`
        SELECT 
          COUNT(*) as total_products,
          COUNT(CASE WHEN status = 'active' AND is_active = true THEN 1 END) as active_products,
          MAX(updated_at) as last_updated,
          pg_size_pretty(pg_total_relation_size('product_search')) as index_size
        FROM product_search
      `);

      const result = stats[0];
      return {
        totalProducts: parseInt(result.total_products),
        activeProducts: parseInt(result.active_products),
        lastUpdated: new Date(result.last_updated),
        indexSize: result.index_size,
      };
    } catch (error) {
      this.logger.error(`Failed to get search table stats: ${error.message}`);
      throw new BadRequestException('Failed to get search table statistics');
    }
  }
}
