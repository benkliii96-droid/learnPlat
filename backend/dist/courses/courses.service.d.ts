import { Repository } from 'typeorm';
import { Course } from './course.entity';
export declare class CoursesService {
    private coursesRepository;
    constructor(coursesRepository: Repository<Course>);
    create(name: string, description: string, order: number): Promise<Course>;
    findAll(): Promise<Course[]>;
    findAllAdmin(): Promise<Course[]>;
    findById(id: string): Promise<Course>;
    update(id: string, data: Partial<Course>): Promise<Course>;
    delete(id: string): Promise<void>;
    getAllWithProgress(userId: string): Promise<any[]>;
}
