import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  findAll(query: any) {
    return this.reviewRepository.find({
      where: query,
      relations: ['customer', 'product', 'order', 'images'],
    });
  }

  findOne(id: number) {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['customer', 'product', 'order', 'images'],
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewRepository.update(id, updateReviewDto);
  }

  remove(id: number) {
    return this.reviewRepository.delete(id);
  }
} 