import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicsService } from '../topics/topics.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProgressService {
  constructor(
    private topicsService: TopicsService,
    private submissionsService: SubmissionsService,
    private usersService: UsersService,
  ) {}

  async getCourseProgress(userId: string, courseId: string): Promise<any> {
    const topics = await this.topicsService.findByCourse(courseId);
    let completedTopics = 0;
    let completedTasks = 0;
    let totalTasks = 0;

    for (const topic of topics) {
      const tasks = topic.tasks || [];
      totalTasks += tasks.length;
      
      let allRequiredCompleted = true;
      let topicCompletedTasks = 0;
      
      for (const task of tasks) {
        const isCompleted = await this.submissionsService.isTaskCompleted(userId, task.id);
        if (isCompleted) {
          completedTasks++;
          topicCompletedTasks++;
        } else if (task.isRequired) {
          allRequiredCompleted = false;
        }
      }
      
      const requiredTasks = tasks.filter(t => t.isRequired);
      if (allRequiredCompleted && requiredTasks.length > 0) {
        completedTopics++;
      }
    }

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      courseId,
      completedTopics,
      totalTopics: topics.length,
      completedTasks,
      totalTasks,
      percentage,
    };
  }

  async getOverallProgress(userId: string): Promise<any> {
    // Возвращает общий прогресс пользователя из таблицы users
    const stats = await this.usersService.getStats(userId);
    return {
      totalPoints: stats.totalPoints,
      completedTopics: stats.completedTopics,
      completedTasks: stats.completedTasks,
    };
  }

  async updateTopicsProgress(userId: string, courseId: string): Promise<number> {
    const topics = await this.topicsService.findByCourse(courseId);
    let completedTopics = 0;

    for (const topic of topics) {
      const tasks = topic.tasks || [];
      const requiredTasks = tasks.filter(t => t.isRequired);
      
      if (requiredTasks.length === 0) {
        completedTopics++;
        continue;
      }

      let allRequiredCompleted = true;
      for (const task of requiredTasks) {
        const isCompleted = await this.submissionsService.isTaskCompleted(userId, task.id);
        if (!isCompleted) {
          allRequiredCompleted = false;
          break;
        }
      }
      
      if (allRequiredCompleted) {
        completedTopics++;
      }
    }

    // Обновляем количество пройденных тем в профиле пользователя
    const currentStats = await this.usersService.getStats(userId);
    if (completedTopics > currentStats.completedTopics) {
      // Нужно обновить - добавить разницу
      const diff = completedTopics - currentStats.completedTopics;
      for (let i = 0; i < diff; i++) {
        await this.usersService.incrementCompletedTopics(userId);
      }
    }

    return completedTopics;
  }
}

