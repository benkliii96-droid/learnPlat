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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const topics_service_1 = require("../topics/topics.service");
const submissions_service_1 = require("../submissions/submissions.service");
const users_service_1 = require("../users/users.service");
let ProgressService = class ProgressService {
    constructor(topicsService, submissionsService, usersService) {
        this.topicsService = topicsService;
        this.submissionsService = submissionsService;
        this.usersService = usersService;
    }
    async getCourseProgress(userId, courseId) {
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
                }
                else if (task.isRequired) {
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
    async getOverallProgress(userId) {
        const stats = await this.usersService.getStats(userId);
        return {
            totalPoints: stats.totalPoints,
            completedTopics: stats.completedTopics,
            completedTasks: stats.completedTasks,
        };
    }
    async updateTopicsProgress(userId, courseId) {
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
        const currentStats = await this.usersService.getStats(userId);
        if (completedTopics > currentStats.completedTopics) {
            const diff = completedTopics - currentStats.completedTopics;
            for (let i = 0; i < diff; i++) {
                await this.usersService.incrementCompletedTopics(userId);
            }
        }
        return completedTopics;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [topics_service_1.TopicsService,
        submissions_service_1.SubmissionsService,
        users_service_1.UsersService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map