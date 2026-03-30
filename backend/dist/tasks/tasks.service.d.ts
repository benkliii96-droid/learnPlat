import { Repository } from 'typeorm';
import { Task, TaskType } from './task.entity';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    create(data: {
        topicId: string;
        name: string;
        description: string;
        type: TaskType;
        starterCode?: string;
        tests?: any;
        solution?: string;
        criteria?: string;
        maxPoints?: number;
        isRequired?: boolean;
    }): Promise<Task>;
    findByTopic(topicId: string): Promise<Task[]>;
    findById(id: string): Promise<Task>;
    findAllAdmin(): Promise<Task[]>;
    update(id: string, data: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    getRequiredTasksCount(topicId: string): Promise<number>;
    search(query: string): Promise<Task[]>;
}
