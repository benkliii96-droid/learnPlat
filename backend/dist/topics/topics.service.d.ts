import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
export declare class TopicsService {
    private topicsRepository;
    constructor(topicsRepository: Repository<Topic>);
    create(courseId: string, name: string, content: string, order: number): Promise<Topic>;
    findByCourse(courseId: string): Promise<Topic[]>;
    findById(id: string): Promise<Topic>;
    findAllAdmin(): Promise<Topic[]>;
    update(id: string, data: Partial<Topic>): Promise<Topic>;
    delete(id: string): Promise<void>;
    getCountByCourse(courseId: string): Promise<number>;
}
