import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';
import { Task } from '../tasks/task.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Course, (course) => course.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @OneToMany(() => Task, (task) => task.topic)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
