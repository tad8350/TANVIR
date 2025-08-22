import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { BrandProfile } from '../../users/entities/brand-profile.entity';
import { Category } from './category.entity';

@Entity('product_search')
export class ProductSearch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ name: 'brand_name', nullable: true })
  brandName: string;

  @Column({ name: 'brand_id', nullable: true })
  brand_id: number;

  @Column({ name: 'category_name', nullable: true })
  categoryName: string;

  @Column({ name: 'category_id', nullable: true })
  category_id: number;

  @Column({ name: 'category_level1', nullable: true })
  categoryLevel1: string;

  @Column({ name: 'category_level2', nullable: true })
  categoryLevel2: string;

  @Column({ name: 'category_level3', nullable: true })
  categoryLevel3: string;

  @Column({ name: 'category_level4', nullable: true })
  categoryLevel4: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'sale_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'tsvector', nullable: true })
  searchDocument: any; // TypeORM doesn't have native tsvector support

  @Column({ name: 'search_rank', type: 'decimal', precision: 5, scale: 4, nullable: true })
  searchRank: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => BrandProfile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandProfile;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
