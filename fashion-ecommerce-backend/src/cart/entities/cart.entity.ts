import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'product_variant_id' })
  product_variant_id: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ name: 'added_at' })
  added_at: Date;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Relations
  @ManyToOne(() => User, user => user.cart)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ProductVariant, variant => variant.cartItems)
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;
} 