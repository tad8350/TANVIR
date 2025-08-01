import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { CustomerProfile } from '../../users/entities/customer-profile.entity';
import { ReviewImage } from './review-image.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customer_id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'order_id', nullable: true })
  order_id: number;

  @Column({ name: 'review_text', type: 'text', nullable: true })
  review_text: string;

  @Column({ name: 'star_rating' })
  star_rating: number;

  @Column({ name: 'is_verified_purchase', default: false })
  is_verified_purchase: boolean;

  @Column({ name: 'is_helpful', default: 0 })
  is_helpful: number;

  @Column({ name: 'is_not_helpful', default: 0 })
  is_not_helpful: number;

  @Column({ name: 'is_approved', default: false })
  is_approved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => CustomerProfile)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerProfile;

  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(() => ReviewImage, image => image.review)
  images: ReviewImage[];
} 