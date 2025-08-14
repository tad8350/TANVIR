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

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'logo_url', nullable: true })
  logo_url: string;

  @Column({ name: 'banner_url', nullable: true })
  banner_url: string;

  @Column({ name: 'website_url', nullable: true })
  website_url: string;

  // Social Media Links
  @Column({ name: 'facebook_url', nullable: true })
  facebook_url: string;

  @Column({ name: 'instagram_url', nullable: true })
  instagram_url: string;

  @Column({ name: 'twitter_url', nullable: true })
  twitter_url: string;

  @Column({ name: 'linkedin_url', nullable: true })
  linkedin_url: string;

  // Contact Information
  @Column({ name: 'contact_email', nullable: true })
  contact_email: string;

  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  district: string;

  // Business Details
  @Column({ name: 'registration_number', nullable: true })
  registration_number: string;

  @Column({ name: 'business_license', nullable: true })
  business_license: string;

  @Column({ name: 'tax_id', nullable: true })
  tax_id: string;

  @Column({ name: 'tin_number', nullable: true })
  tin_number: string;

  @Column({ name: 'trade_license', nullable: true })
  trade_license: string;

  @Column({ name: 'vat_registration', nullable: true })
  vat_registration: string;

  @Column({ name: 'import_export_license', nullable: true })
  import_export_license: string;

  // Payment Information
  @Column({ name: 'payment_method', nullable: true })
  payment_method: string;

  @Column({ name: 'payment_phone', nullable: true })
  payment_phone: string;

  @Column({ name: 'account_holder_name', nullable: true })
  account_holder_name: string;

  @Column({ name: 'payment_email', nullable: true })
  payment_email: string;

  // Operational Details
  @Column({ name: 'warehouse_location', nullable: true })
  warehouse_location: string;

  @Column({ name: 'physical_shops', nullable: true })
  physical_shops: string;

  @Column({ name: 'return_policy', nullable: true })
  return_policy: string;

  @Column({ name: 'warranty_policy', nullable: true })
  warranty_policy: string;

  @Column({ name: 'minimum_order_quantity', nullable: true })
  minimum_order_quantity: string;

  @Column({ name: 'shipping_zones', nullable: true })
  shipping_zones: string;

  // Partnership Settings
  @Column({ name: 'commission_rate', type: 'numeric', nullable: true })
  commission_rate: number;

  @Column({ name: 'payment_terms', nullable: true })
  payment_terms: string;

  @Column({ name: 'commission_structure', type: 'text', nullable: true })
  commission_structure: string;

  @Column({ name: 'payment_schedule', nullable: true })
  payment_schedule: string;

  @Column({ name: 'minimum_payout_amount', nullable: true })
  minimum_payout_amount: string;

  @Column({ name: 'tax_deduction_details', type: 'text', nullable: true })
  tax_deduction_details: string;

  // Brand Owner Account
  @Column({ name: 'owner_full_name', nullable: true })
  owner_full_name: string;

  @Column({ name: 'owner_email', nullable: true })
  owner_email: string;

  @Column({ name: 'owner_password', nullable: true })
  owner_password: string;

  // Generated Login Password (for brand portal access)
  @Column({ name: 'generated_password', nullable: true })
  generated_password: string;

  // Technical & Integration
  @Column({ name: 'api_keys', type: 'text', nullable: true })
  api_keys: string;

  @Column({ name: 'webhook_urls', type: 'text', nullable: true })
  webhook_urls: string;

  @Column({ name: 'integration_settings', type: 'text', nullable: true })
  integration_settings: string;

  // Legacy fields (keeping for backward compatibility)
  @Column({ name: 'contact_person', nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

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