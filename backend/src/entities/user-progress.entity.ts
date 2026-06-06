import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_progress')
export class UserProgress {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ default: 15, name: 'total_forms' })
  totalForms: number;

  @Column({ default: 0, name: 'completed_forms' })
  completedForms: number;

  @Column({ nullable: true, name: 'current_form' })
  currentForm?: number;

  @Column({ nullable: true, name: 'last_activity', type: 'datetime' })
  lastActivity?: Date;

  @Column({ nullable: true, name: 'started_at', type: 'datetime' })
  startedAt?: Date;

  @Column({ nullable: true, name: 'completed_at', type: 'datetime' })
  completedAt?: Date;

  @OneToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
