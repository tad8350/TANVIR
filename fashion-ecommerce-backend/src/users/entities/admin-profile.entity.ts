import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('admin_profiles')
export class AdminProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  user_id: number;

  @Column({ name: 'first_name', nullable: true })
  first_name: string;

  @Column({ name: 'last_name', nullable: true })
  last_name: string;

  @Column({ nullable: true })
  role: string;

  @Column({ type: 'json', nullable: true })
  permissions: any;

  // Relations
  @OneToOne(() => User, user => user.adminProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 