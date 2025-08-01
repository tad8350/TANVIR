import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PromoCode } from './promo-code.entity';

@Entity('user_promos')
export class UserPromo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'promo_code_id' })
  promo_code_id: number;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  used_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PromoCode, promoCode => promoCode.userPromos)
  @JoinColumn({ name: 'promo_code_id' })
  promoCode: PromoCode;
} 