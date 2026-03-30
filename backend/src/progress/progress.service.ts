import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressService {
  constructor() {}

  async getCourseProgress(userId: string, courseId: string): Promise<any> {
    // Здесь можно реализовать более сложную логику подсчёта прогресса
    // Пока возвращаем базовую информацию
    return {
      courseId,
      completedTopics: 0,
      totalTopics: 0,
      completedTasks: 0,
      totalTasks: 0,
      percentage: 0,
    };
  }

  async getOverallProgress(userId: string): Promise<any> {
    // Возвращает общий прогресс пользователя
    return {
      totalPoints: 0,
      completedTopics: 0,
      completedTasks: 0,
    };
  }
}
