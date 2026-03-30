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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const topic_entity_1 = require("./topic.entity");
let TopicsService = class TopicsService {
    constructor(topicsRepository) {
        this.topicsRepository = topicsRepository;
    }
    async create(courseId, name, content, order) {
        const topic = this.topicsRepository.create({ courseId, name, content, order });
        return this.topicsRepository.save(topic);
    }
    async findByCourse(courseId) {
        return this.topicsRepository.find({
            where: { courseId, isPublished: true },
            order: { order: 'ASC' },
            relations: ['tasks'],
        });
    }
    async findById(id) {
        const topic = await this.topicsRepository.findOne({
            where: { id },
            relations: ['course', 'tasks'],
        });
        if (!topic) {
            throw new common_1.NotFoundException('Тема не найдена');
        }
        return topic;
    }
    async findAllAdmin() {
        return this.topicsRepository.find({
            order: { order: 'ASC' },
            relations: ['course', 'tasks'],
        });
    }
    async update(id, data) {
        await this.topicsRepository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.topicsRepository.delete(id);
    }
    async getCountByCourse(courseId) {
        return this.topicsRepository.count({ where: { courseId, isPublished: true } });
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(topic_entity_1.Topic)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TopicsService);
//# sourceMappingURL=topics.service.js.map