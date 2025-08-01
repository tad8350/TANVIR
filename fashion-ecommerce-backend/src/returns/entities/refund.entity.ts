import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Return } from './return.entity';
import { User } from '../../users/entities/user.entity';

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'return_id' })
  return_id: number;

  @Column({ name: 'refund_amount', type: 'numeric' })
  refund_amount: number;

  @Column({ name: 'refund_method' })
  refund_method: string;

  @Column({ name: 'refund_status' })
  refund_status: string;

  @Column({ name: 'processed_by', nullable: true })
  processed_by: number;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processed_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Return, returnEntity => returnEntity.refunds)
  @JoinColumn({ name: 'return_id' })
  return: Return;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'processed_by' })
  processedBy: User;
} 