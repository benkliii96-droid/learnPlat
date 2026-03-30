import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(name: string, description: string, order: number): Promise<Course> {
    const course = this.coursesRepository.create({ name, description, order });
    return this.coursesRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      order: { order: 'ASC' },
      where: { isPublished: true },
      relations: ['topics', 'topics.tasks'],
    });
  }

  async findAllAdmin(): Promise<Course[]> {
    return this.coursesRepository.find({
      order: { order: 'ASC' },
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['topics', 'topics.tasks'],
    });
    if (!course) {
      throw new NotFoundException('Курс не найден');
    }
    return course;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    await this.coursesRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.coursesRepository.delete(id);
  }

  async getAllWithProgress(userId: string): Promise<any[]> {
    const courses = await this.coursesRepository.find({
      order: { order: 'ASC' },
      where: { isPublished: true },
      relations: ['topics', 'topics.tasks'],
    });

    return courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      order: course.order,
      totalTopics: course.topics?.length || 0,
      totalTasks: course.topics?.reduce((acc, topic) => acc + (topic.tasks?.length || 0), 0) || 0,
    }));
  }
}
