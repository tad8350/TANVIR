import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  type: string;

  @Column()
  channel: string;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  status: string;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sent_at: Date;

  @Column({ type: 'json', nullable: true })
  meta: any;

  // Relations
  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
