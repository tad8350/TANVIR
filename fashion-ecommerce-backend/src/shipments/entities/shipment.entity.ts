import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  order_id: number;

  @Column({ name: 'courier_name' })
  courier_name: string;

  @Column({ name: 'tracking_number' })
  tracking_number: string;

  @Column()
  status: string;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shipped_at: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  delivered_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Order, order => order.shipments)
  @JoinColumn({ name: 'order_id' })
  order: Order;
} 