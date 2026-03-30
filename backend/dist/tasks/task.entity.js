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
exports.Task = exports.TaskType = void 0;
const typeorm_1 = require("typeorm");
const topic_entity_1 = require("../topics/topic.entity");
const submission_entity_1 = require("../submissions/submission.entity");
var TaskType;
(function (TaskType) {
    TaskType["AUTO"] = "auto";
    TaskType["MANUAL"] = "manual";
})(TaskType || (exports.TaskType = TaskType = {}));
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TaskType, default: TaskType.MANUAL }),
    __metadata("design:type", String)
], Task.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "starterCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "tests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "solution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 10 }),
    __metadata("design:type", Number)
], Task.prototype, "maxPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Task.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => topic_entity_1.Topic, (topic) => topic.tasks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'topicId' }),
    __metadata("design:type", topic_entity_1.Topic)
], Task.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "topicId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submission_entity_1.Submission, (submission) => submission.task),
    __metadata("design:type", Array)
], Task.prototype, "submissions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);
//# sourceMappingURL=task.entity.js.map