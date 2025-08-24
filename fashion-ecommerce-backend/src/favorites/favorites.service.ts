import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async findAll(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [favorites, total] = await this.favoriteRepository.findAndCount({
      where: { user_id: userId },
      relations: ['product_variant', 'product_variant.product', 'product_variant.product.brand', 'product_variant.product.images'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: favorites,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createFavoriteDto: CreateFavoriteDto) {
    // Check if already exists
    const existing = await this.favoriteRepository.findOne({
      where: {
        user_id: createFavoriteDto.user_id,
        product_variant_id: createFavoriteDto.product_variant_id,
      },
    });

    if (existing) {
      return existing; // Already in favorites
    }

    const favorite = this.favoriteRepository.create({
      user_id: createFavoriteDto.user_id,
      product_variant_id: createFavoriteDto.product_variant_id,
    });
    return this.favoriteRepository.save(favorite);
  }

  async remove(id: number) {
    const favorite = await this.favoriteRepository.findOne({ where: { id } });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }
    await this.favoriteRepository.remove(favorite);
    return { message: 'Removed from favorites successfully' };
  }

  async removeByProduct(userId: number, productVariantId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user_id: userId,
        product_variant_id: productVariantId,
      },
    });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }
    await this.favoriteRepository.remove(favorite);
    return { message: 'Removed from favorites successfully' };
  }
} 