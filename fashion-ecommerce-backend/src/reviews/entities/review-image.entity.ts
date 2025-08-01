import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity('review_images')
export class ReviewImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'review_id' })
  review_id: number;

  @Column({ name: 'image_path', nullable: true })
  image_path: string;

  @Column({ name: 'image_url', nullable: true })
  image_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Review, review => review.images)
  @JoinColumn({ name: 'review_id' })
  review: Review;
} 