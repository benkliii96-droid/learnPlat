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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./course.entity");
let CoursesService = class CoursesService {
    constructor(coursesRepository) {
        this.coursesRepository = coursesRepository;
    }
    async create(name, description, order) {
        const course = this.coursesRepository.create({ name, description, order });
        return this.coursesRepository.save(course);
    }
    async findAll() {
        return this.coursesRepository.find({
            order: { order: 'ASC' },
            where: { isPublished: true },
            relations: ['topics', 'topics.tasks'],
        });
    }
    async findAllAdmin() {
        return this.coursesRepository.find({
            order: { order: 'ASC' },
        });
    }
    async findById(id) {
        const course = await this.coursesRepository.findOne({
            where: { id },
            relations: ['topics', 'topics.tasks'],
        });
        if (!course) {
            throw new common_1.NotFoundException('Курс не найден');
        }
        return course;
    }
    async update(id, data) {
        await this.coursesRepository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.coursesRepository.delete(id);
    }
    async getAllWithProgress(userId) {
        const courses = await this.coursesRepository.find({
            order: { order: 'ASC' },
            where: { isPublished: true },
            relations: ['topics', 'topics.tasks'],
        });
        return courses.map(course => ({
            id: course.id,
            name: course.name,
            description: course.description,
            order: course.order,
            totalTopics: course.topics?.length || 0,
            totalTasks: course.topics?.reduce((acc, topic) => acc + (topic.tasks?.length || 0), 0) || 0,
        }));
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map