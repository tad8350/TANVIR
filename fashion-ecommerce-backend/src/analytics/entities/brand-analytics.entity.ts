import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BrandProfile } from '../../users/entities/brand-profile.entity';

@Entity('brand_analytics')
export class BrandAnalytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_id' })
  brand_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'total_sales', type: 'numeric' })
  total_sales: number;

  @Column({ name: 'total_orders' })
  total_orders: number;

  @Column({ name: 'commission_earned', type: 'numeric' })
  commission_earned: number;

  // Relations
  @ManyToOne(() => BrandProfile)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandProfile;
} 