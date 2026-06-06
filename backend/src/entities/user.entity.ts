import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { UserResponse } from './user-response.entity';
import { UserProgress } from './user-progress.entity';

@Entity('users')
export class User {
  @PrimaryColumn('text')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true, name: 'full_name' })
  fullName?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'last_login', type: 'datetime' })
  lastLogin?: Date;

  @OneToMany(() => UserResponse, (response) => response.user)
  responses: UserResponse[];

  @OneToOne(() => UserProgress, (progress) => progress.user)
  progress: UserProgress;
}
