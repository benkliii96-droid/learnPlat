import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './submission.entity';
import { UsersService } from '../users/users.service';
import { Task, TaskType } from '../tasks/task.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, taskId: string, code?: string, solutionText?: string, filePath?: string): Promise<Submission> {
    const submission = this.submissionsRepository.create({
      userId,
      taskId,
      code,
      solutionText,
      filePath,
      status: SubmissionStatus.PENDING,
    });
    return this.submissionsRepository.save(submission);
  }

  async findByUser(userId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { userId },
      relations: ['task', 'task.topic'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTask(taskId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { status: SubmissionStatus.PENDING },
      relations: ['user', 'task', 'task.topic'],
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne({
      where: { id },
      relations: ['user', 'task', 'task.topic', 'task.topic.course'],
    });
    if (!submission) {
      throw new NotFoundException('Решение не найдено');
    }
    return submission;
  }

  async approve(id: string, points: number, comment: string): Promise<Submission> {
    const submission = await this.findById(id);
    submission.status = SubmissionStatus.APPROVED;
    submission.points = points;
    submission.adminComment = comment;

    await this.submissionsRepository.save(submission);
    await this.usersService.updateStats(submission.userId, points);
    await this.usersService.incrementCompletedTasks(submission.userId);

    return submission;
  }

  async reject(id: string, comment: string): Promise<Submission> {
    const submission = await this.findById(id);
    submission.status = SubmissionStatus.REJECTED;
    submission.adminComment = comment;
    return this.submissionsRepository.save(submission);
  }

  async runAutoTest(submissionId: string): Promise<{ passed: boolean; results: any }> {
    const submission = await this.findById(submissionId);
    const task = submission.task;

    if (task.type !== TaskType.AUTO) {
      throw new Error('Задание не поддерживает автоматическую проверку');
    }

    if (!task.tests || !task.tests.length) {
      throw new Error('Тесты не настроены для этого задания');
    }

    const results = await this.runTests(submission.code, task.tests);
    const passed = results.every((r: any) => r.passed);

    // Сохраняем результаты тестов
    submission.testResults = JSON.stringify(results);
    await this.submissionsRepository.save(submission);

    if (passed) {
      submission.status = SubmissionStatus.APPROVED;
      submission.points = task.maxPoints;
      await this.submissionsRepository.save(submission);
      await this.usersService.updateStats(submission.userId, task.maxPoints);
      await this.usersService.incrementCompletedTasks(submission.userId);
    }

    return { passed, results };
  }

  private async runTests(userCode: string, tests: any[]): Promise<any[]> {
    const results: any[] = [];

    for (const test of tests) {
      try {
        // Создаём безопасную среду для выполнения кода
        const vm = require('vm');
        
        // Подготавливаем код пользователя с тестом
        const fullCode = `
          ${userCode}
          ${test.testCode}
        `;

        const context = {};
        vm.createContext(context);
        
        try {
          const result = vm.runInContext(fullCode, context, { timeout: 5000 });
          const expected = test.expected;
          const passed = JSON.stringify(result) === JSON.stringify(expected);
          
          results.push({
            name: test.name,
            passed,
            expected,
            actual: result,
            error: null,
          });
        } catch (e: any) {
          results.push({
            name: test.name,
            passed: false,
            expected: test.expected,
            actual: null,
            error: e.message,
          });
        }
      } catch (e: any) {
        results.push({
          name: test.name || 'Test',
          passed: false,
          error: e.message,
        });
      }
    }

    return results;
  }

  async getUserSubmissionsByTask(userId: string, taskId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { userId, taskId },
      order: { createdAt: 'DESC' },
    });
  }

  async isTaskCompleted(userId: string, taskId: string): Promise<boolean> {
    const submission = await this.submissionsRepository.findOne({
      where: { userId, taskId, status: SubmissionStatus.APPROVED },
    });
    return !!submission;
  }
}
