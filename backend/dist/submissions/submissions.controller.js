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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let SubmissionsController = class SubmissionsController {
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async create(req, body) {
        return this.submissionsService.create(req.user.userId, body.taskId, body.code, body.solutionText);
    }
    async findMySubmissions(req) {
        return this.submissionsService.findByUser(req.user.userId);
    }
    async findByTask(taskId) {
        return this.submissionsService.findByTask(taskId);
    }
    async getMySubmissionsByTask(req, taskId) {
        return this.submissionsService.getUserSubmissionsByTask(req.user.userId, taskId);
    }
    async isTaskCompleted(req, taskId) {
        const completed = await this.submissionsService.isTaskCompleted(req.user.userId, taskId);
        return { completed };
    }
    async findPending() {
        return this.submissionsService.findPending();
    }
    async findById(id) {
        return this.submissionsService.findById(id);
    }
    async runAutoTest(id) {
        return this.submissionsService.runAutoTest(id);
    }
    async approve(id, body) {
        return this.submissionsService.approve(id, body.points, body.comment);
    }
    async reject(id, body) {
        return this.submissionsService.reject(id, body.comment);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findMySubmissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('task/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findByTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('task/:taskId/my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "getMySubmissionsByTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('task/:taskId/completed'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "isTaskCompleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findPending", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/run'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "runAutoTest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "reject", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)('submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map