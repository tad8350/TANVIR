import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BrandProfile } from './brand-profile.entity';

@Entity('brand_locations')
export class BrandLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_id' })
  brand_id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ name: 'contact_number', nullable: true })
  contact_number: string;

  @Column({ name: 'is_primary', default: false })
  is_primary: boolean;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'contact_email', nullable: true })
  contact_email: string;

  @Column({ type: 'numeric', nullable: true })
  latitude: number;

  @Column({ type: 'numeric', nullable: true })
  longitude: number;

  @Column({ name: 'business_hours', type: 'json', nullable: true })
  business_hours: any;

  @Column({ name: 'address_line2', nullable: true })
  address_line2: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => BrandProfile, brand => brand.locations)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandProfile;
} 