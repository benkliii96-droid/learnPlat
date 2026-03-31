"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const submission_entity_1 = require("./submission.entity");
const users_service_1 = require("../users/users.service");
const tasks_service_1 = require("../tasks/tasks.service");
const progress_service_1 = require("../progress/progress.service");
const task_entity_1 = require("../tasks/task.entity");
let SubmissionsService = class SubmissionsService {
    constructor(submissionsRepository, usersService, tasksService, progressService) {
        this.submissionsRepository = submissionsRepository;
        this.usersService = usersService;
        this.tasksService = tasksService;
        this.progressService = progressService;
    }
    async create(userId, taskId, code, solutionText, filePath) {
        const submission = this.submissionsRepository.create({
            userId,
            taskId,
            code,
            solutionText,
            filePath,
            status: submission_entity_1.SubmissionStatus.PENDING,
        });
        return this.submissionsRepository.save(submission);
    }
    async findByUser(userId) {
        return this.submissionsRepository.find({
            where: { userId },
            relations: ['task', 'task.topic'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByTask(taskId) {
        return this.submissionsRepository.find({
            where: { taskId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findPending() {
        return this.submissionsRepository.find({
            where: { status: submission_entity_1.SubmissionStatus.PENDING },
            relations: ['user', 'task', 'task.topic'],
            order: { createdAt: 'ASC' },
        });
    }
    async findById(id) {
        const submission = await this.submissionsRepository.findOne({
            where: { id },
            relations: ['user', 'task', 'task.topic', 'task.topic.course'],
        });
        if (!submission) {
            throw new common_1.NotFoundException('Решение не найдено');
        }
        return submission;
    }
    async approve(id, points, comment) {
        const submission = await this.findById(id);
        submission.status = submission_entity_1.SubmissionStatus.APPROVED;
        submission.points = points;
        submission.adminComment = comment;
        await this.submissionsRepository.save(submission);
        await this.usersService.updateStats(submission.userId, points);
        await this.usersService.incrementCompletedTasks(submission.userId);
        const task = await this.tasksService.findById(submission.taskId);
        if (task?.topic?.courseId) {
            try {
                await this.progressService.updateTopicsProgress(submission.userId, task.topic.courseId);
            }
            catch (e) {
            }
        }
        return submission;
    }
    async reject(id, comment) {
        const submission = await this.findById(id);
        submission.status = submission_entity_1.SubmissionStatus.REJECTED;
        submission.adminComment = comment;
        return this.submissionsRepository.save(submission);
    }
    async runAutoTest(submissionId) {
        const submission = await this.findById(submissionId);
        const task = submission.task;
        if (task.type !== task_entity_1.TaskType.AUTO) {
            throw new Error('Задание не поддерживает автоматическую проверку');
        }
        if (!task.tests || !task.tests.length) {
            throw new Error('Тесты не настроены для этого задания');
        }
        const results = await this.runTests(submission.code, task.tests);
        const passed = results.every((r) => r.passed);
        submission.testResults = JSON.stringify(results);
        await this.submissionsRepository.save(submission);
        if (passed) {
            submission.status = submission_entity_1.SubmissionStatus.APPROVED;
            submission.points = task.maxPoints;
            await this.submissionsRepository.save(submission);
            await this.usersService.updateStats(submission.userId, task.maxPoints);
            await this.usersService.incrementCompletedTasks(submission.userId);
        }
        return { passed, results };
    }
    async runTests(userCode, tests) {
        const results = [];
        for (const test of tests) {
            try {
                const vm = require('vm');
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
                }
                catch (e) {
                    results.push({
                        name: test.name,
                        passed: false,
                        expected: test.expected,
                        actual: null,
                        error: e.message,
                    });
                }
            }
            catch (e) {
                results.push({
                    name: test.name || 'Test',
                    passed: false,
                    error: e.message,
                });
            }
        }
        return results;
    }
    async getUserSubmissionsByTask(userId, taskId) {
        return this.submissionsRepository.find({
            where: { userId, taskId },
            order: { createdAt: 'DESC' },
        });
    }
    async isTaskCompleted(userId, taskId) {
        const submission = await this.submissionsRepository.findOne({
            where: { userId, taskId, status: submission_entity_1.SubmissionStatus.APPROVED },
        });
        return !!submission;
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(submission_entity_1.Submission)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => progress_service_1.ProgressService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        tasks_service_1.TasksService,
        progress_service_1.ProgressService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map