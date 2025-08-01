import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Refund } from './refund.entity';

@Entity('returns')
export class Return {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  order_id: number;

  @Column({ name: 'order_item_id' })
  order_item_id: number;

  @Column()
  status: string;

  @Column()
  reason: string;

  @Column({ name: 'refund_status' })
  refund_status: string;

  @CreateDateColumn({ name: 'requested_at' })
  requested_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Order, order => order.returns)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => OrderItem, orderItem => orderItem.returns)
  @JoinColumn({ name: 'order_item_id' })
  order_item: OrderItem;

  @OneToMany(() => Refund, refund => refund.return)
  refunds: Refund[];
} 