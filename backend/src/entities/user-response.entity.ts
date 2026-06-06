import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Form } from './form.entity';

@Entity('user_responses')
export class UserResponse {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'form_id' })
  formId: number;

  @Column({ type: 'text', name: 'form_data' })
  formData: string; // JSON almacenado como texto

  @Column({ default: 'draft' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'submitted_at', type: 'datetime' })
  submittedAt?: Date;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => User, (user) => user.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Form, (form) => form.responses)
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
