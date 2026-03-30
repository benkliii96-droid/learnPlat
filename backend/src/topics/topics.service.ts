import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {}

  async create(courseId: string, name: string, content: string, order: number): Promise<Topic> {
    const topic = this.topicsRepository.create({ courseId, name, content, order });
    return this.topicsRepository.save(topic);
  }

  async findByCourse(courseId: string): Promise<Topic[]> {
    return this.topicsRepository.find({
      where: { courseId, isPublished: true },
      order: { order: 'ASC' },
      relations: ['tasks'],
    });
  }

  async findById(id: string): Promise<Topic> {
    const topic = await this.topicsRepository.findOne({
      where: { id },
      relations: ['course', 'tasks'],
    });
    if (!topic) {
      throw new NotFoundException('Тема не найдена');
    }
    return topic;
  }

  async findAllAdmin(): Promise<Topic[]> {
    return this.topicsRepository.find({
      order: { order: 'ASC' },
      relations: ['course', 'tasks'],
    });
  }

  async update(id: string, data: Partial<Topic>): Promise<Topic> {
    await this.topicsRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.topicsRepository.delete(id);
  }

  async getCountByCourse(courseId: string): Promise<number> {
    return this.topicsRepository.count({ where: { courseId, isPublished: true } });
  }
}
