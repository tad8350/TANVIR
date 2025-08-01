import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerProfile } from '../../users/entities/customer-profile.entity';
import { Category } from '../../products/entities/category.entity';

@Entity('customer_preferences')
export class CustomerPreferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customer_id: number;

  @Column({ name: 'category_id' })
  category_id: number;

  @Column({ name: 'preference_score', type: 'numeric' })
  preference_score: number;

  // Relations
  @ManyToOne(() => CustomerProfile)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerProfile;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
} 