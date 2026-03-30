import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskType } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(data: {
    topicId: string;
    name: string;
    description: string;
    type: TaskType;
    starterCode?: string;
    tests?: any;
    solution?: string;
    criteria?: string;
    maxPoints?: number;
    isRequired?: boolean;
  }): Promise<Task> {
    const task = this.tasksRepository.create(data);
    return this.tasksRepository.save(task);
  }

  async findByTopic(topicId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { topicId, isPublished: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['topic', 'topic.course'],
    });
    if (!task) {
      throw new NotFoundException('Задание не найдено');
    }
    return task;
  }

  async findAllAdmin(): Promise<Task[]> {
    return this.tasksRepository.find({
      order: { createdAt: 'ASC' },
      relations: ['topic', 'topic.course'],
    });
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    await this.tasksRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async getRequiredTasksCount(topicId: string): Promise<number> {
    return this.tasksRepository.count({ where: { topicId, isRequired: true, isPublished: true } });
  }

  async search(query: string): Promise<Task[]> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .where('task.name ILIKE :query OR task.description ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('task.topic', 'topic')
      .getMany();
  }
}
