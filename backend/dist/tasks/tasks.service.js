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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
let TasksService = class TasksService {
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    async create(data) {
        const task = this.tasksRepository.create(data);
        return this.tasksRepository.save(task);
    }
    async findByTopic(topicId) {
        return this.tasksRepository.find({
            where: { topicId, isPublished: true },
            order: { createdAt: 'ASC' },
        });
    }
    async findById(id) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['topic', 'topic.course'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Задание не найдено');
        }
        return task;
    }
    async findAllAdmin() {
        return this.tasksRepository.find({
            order: { createdAt: 'ASC' },
            relations: ['topic', 'topic.course'],
        });
    }
    async update(id, data) {
        await this.tasksRepository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.tasksRepository.delete(id);
    }
    async getRequiredTasksCount(topicId) {
        return this.tasksRepository.count({ where: { topicId, isRequired: true, isPublished: true } });
    }
    async search(query) {
        return this.tasksRepository
            .createQueryBuilder('task')
            .where('task.name ILIKE :query OR task.description ILIKE :query', { query: `%${query}%` })
            .leftJoinAndSelect('task.topic', 'topic')
            .getMany();
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map