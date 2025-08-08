import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { AdminProfile } from './admin-profile.entity';
import { BrandProfile } from './brand-profile.entity';
import { CustomerProfile } from './customer-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ name: 'user_type' })
  user_type: string;

  @Column({ name: 'is_verified', default: false })
  is_verified: boolean;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @OneToMany(() => Cart, cart => cart.user)
  cart: Cart[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  // Admin profiles are handled separately

  @OneToOne(() => BrandProfile)
  brandProfile: BrandProfile;

  @OneToOne(() => CustomerProfile)
  customerProfile: CustomerProfile;
}