import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Task, (task) => task.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  taskId: string;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  solutionText: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'text', nullable: true })
  testResults: string;

  @Column({ type: 'text', nullable: true })
  adminComment: string;

  @CreateDateColumn()
  createdAt: Date;
}
