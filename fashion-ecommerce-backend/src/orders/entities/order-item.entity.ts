import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Return } from '../../returns/entities/return.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  order_id: number;

  @Column({ name: 'product_variant_id' })
  product_variant_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'numeric' })
  price: number;

  // Relations
  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant, variant => variant.orderItems)
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;

  @OneToMany(() => Return, returnItem => returnItem.order_item)
  returns: Return[];
} 