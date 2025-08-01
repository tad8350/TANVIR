import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'color_id', nullable: true })
  color_id: number;

  @Column({ name: 'size_id', nullable: true })
  size_id: number;

  @Column()
  stock: number;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ name: 'discount_price', type: 'numeric', nullable: true })
  discount_price: number;

  @Column({ unique: true })
  sku: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Relations
  @ManyToOne(() => Product, product => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Color, color => color.variants)
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Size, size => size.variants)
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @OneToMany(() => Cart, cart => cart.product_variant)
  cartItems: Cart[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product_variant)
  orderItems: OrderItem[];

  @OneToMany(() => Favorite, favorite => favorite.product_variant)
  favorites: Favorite[];
} 