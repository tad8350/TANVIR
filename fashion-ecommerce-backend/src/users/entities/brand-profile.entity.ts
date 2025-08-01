import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Product } from '../../products/entities/product.entity';
import { BrandLocation } from './brand-location.entity';

@Entity('brand_profiles')
export class BrandProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  user_id: number;

  @Column({ name: 'brand_name' })
  brand_name: string;

  @Column({ name: 'business_name', nullable: true })
  business_name: string;

  @Column({ name: 'tax_id', nullable: true })
  tax_id: string;

  @Column({ name: 'business_license', nullable: true })
  business_license: string;

  @Column({ name: 'contact_person', nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'logo_url', nullable: true })
  logo_url: string;

  @Column({ name: 'banner_url', nullable: true })
  banner_url: string;

  @Column({ name: 'commission_rate', type: 'numeric', nullable: true })
  commission_rate: number;

  @Column({ name: 'payment_methods', type: 'json', nullable: true })
  payment_methods: any;

  @Column({ name: 'shipping_methods', type: 'json', nullable: true })
  shipping_methods: any;

  @Column({ name: 'is_verified', default: false })
  is_verified: boolean;

  @Column({ name: 'bank_account', type: 'json', nullable: true })
  bank_account: any;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @OneToOne(() => User, user => user.brandProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];

  @OneToMany(() => BrandLocation, location => location.brand)
  locations: BrandLocation[];
} 