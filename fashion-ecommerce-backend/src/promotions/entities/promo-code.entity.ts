import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BrandProfile } from '../../users/entities/brand-profile.entity';
import { Campaign } from './campaign.entity';
import { UserPromo } from './user-promo.entity';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  type: string;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ name: 'usage_limit', nullable: true })
  usage_limit: number;

  @Column({ name: 'valid_from', type: 'timestamp' })
  valid_from: Date;

  @Column({ name: 'valid_to', type: 'timestamp' })
  valid_to: Date;

  @Column({ name: 'brand_id', nullable: true })
  brand_id: number;

  @Column({ name: 'campaign_id', nullable: true })
  campaign_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => BrandProfile)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandProfile;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @OneToMany(() => UserPromo, userPromo => userPromo.promoCode)
  userPromos: UserPromo[];
} 