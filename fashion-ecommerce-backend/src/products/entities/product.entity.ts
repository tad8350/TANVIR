import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BrandProfile } from '../../users/entities/brand-profile.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_id', nullable: true })
  brand_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'sale_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ name: 'category_id', nullable: true })
  category_id: number;

  // Category hierarchy fields
  @Column({ name: 'category_level1', nullable: true })
  categoryLevel1: string;

  @Column({ name: 'category_level2', nullable: true })
  categoryLevel2: string;

  @Column({ name: 'category_level3', nullable: true })
  categoryLevel3: string;

  @Column({ name: 'category_level4', nullable: true })
  categoryLevel4: string;

  @Column({ name: 'category', nullable: true })
  category: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Inventory fields
  @Column({ name: 'low_stock_threshold', type: 'int', nullable: true })
  lowStockThreshold: number;

  // SEO & Marketing fields
  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  // Shipping fields
  @Column({ name: 'shipping_weight', type: 'decimal', precision: 8, scale: 3, nullable: true })
  shippingWeight: number;

  @Column({ name: 'shipping_length', type: 'decimal', precision: 8, scale: 2, nullable: true })
  shippingLength: number;

  @Column({ name: 'shipping_width', type: 'decimal', precision: 8, scale: 2, nullable: true })
  shippingWidth: number;

  @Column({ name: 'shipping_height', type: 'decimal', precision: 8, scale: 2, nullable: true })
  shippingHeight: number;

  @Column({ name: 'free_shipping', default: false })
  freeShipping: boolean;

  @Column({ name: 'shipping_class', nullable: true })
  shippingClass: string;

  // Tax fields
  @Column({ name: 'tax_class', nullable: true })
  taxClass: string;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  // Inventory management
  @Column({ name: 'track_inventory', default: true })
  trackInventory: boolean;

  @Column({ name: 'allow_backorders', default: false })
  allowBackorders: boolean;

  @Column({ name: 'max_order_quantity', type: 'int', nullable: true })
  maxOrderQuantity: number;

  @Column({ name: 'min_order_quantity', type: 'int', default: 1 })
  minOrderQuantity: number;

  // Advanced fields
  @Column({ name: 'is_virtual', default: false })
  isVirtual: boolean;

  @Column({ name: 'is_downloadable', default: false })
  isDownloadable: boolean;

  @Column({ name: 'download_limit', type: 'int', nullable: true })
  downloadLimit: number;

  @Column({ name: 'download_expiry', type: 'int', nullable: true })
  downloadExpiry: number;

  // Variants
  @Column({ name: 'has_variants', default: false })
  hasVariants: boolean;

  @Column({ name: 'variant_type', nullable: true })
  variantType: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => BrandProfile, brand => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandProfile;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  categoryRelation: Category;

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, image => image.product)
  images: ProductImage[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}
