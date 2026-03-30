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
let ProgressService = class ProgressService {
    constructor() { }
    async getCourseProgress(userId, courseId) {
        return {
            courseId,
            completedTopics: 0,
            totalTopics: 0,
            completedTasks: 0,
            totalTasks: 0,
            percentage: 0,
        };
    }
    async getOverallProgress(userId) {
        return {
            totalPoints: 0,
            completedTopics: 0,
            completedTasks: 0,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProgressService);
//# sourceMappingURL=progress.service.js.map