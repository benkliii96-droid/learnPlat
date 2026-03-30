import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { Submission } from '../submissions/submission.entity';

export enum TaskType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskType, default: TaskType.MANUAL })
  type: TaskType;

  @Column({ type: 'text', nullable: true })
  starterCode: string;

  @Column({ type: 'jsonb', nullable: true })
  tests: any;

  @Column({ type: 'text', nullable: true })
  solution: string;

  @Column({ type: 'text', nullable: true })
  criteria: string;

  @Column({ default: 10 })
  maxPoints: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Topic, (topic) => topic.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column()
  topicId: string;

  @OneToMany(() => Submission, (submission) => submission.task)
  submissions: Submission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
