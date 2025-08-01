import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Shipment } from '../../shipments/entities/shipment.entity';
import { Return } from '../../returns/entities/return.entity';
import { Address } from '../../common/entities/address.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  status: string;

  @Column({ name: 'total_amount', type: 'numeric' })
  total_amount: number;

  @Column({ name: 'subtotal_amount', type: 'numeric' })
  subtotal_amount: number;

  @Column({ name: 'shipping_cost', type: 'numeric' })
  shipping_cost: number;

  @Column({ name: 'tax_amount', type: 'numeric' })
  tax_amount: number;

  @Column({ name: 'discount_amount', type: 'numeric' })
  discount_amount: number;

  @Column({ name: 'payment_status' })
  payment_status: string;

  @Column({ name: 'shipping_address_id', nullable: true })
  shipping_address_id: number;

  @Column({ name: 'shipping_method' })
  shipping_method: string;

  @Column({ name: 'estimated_delivery_date', type: 'date', nullable: true })
  estimated_delivery_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: Address;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];

  @OneToMany(() => Shipment, shipment => shipment.order)
  shipments: Shipment[];

  @OneToMany(() => Return, returnItem => returnItem.order)
  returns: Return[];
} 