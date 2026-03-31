import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  async getCourseProgress(userId: string, courseId: string): Promise<any> {
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
    return {
      totalPoints: 0,
      completedTopics: 0,
      completedTasks: 0,
    };
  }

  async updateTopicsProgress(userId: string, courseId: string): Promise<number> {
    return 0;
  }
}

