import { TasksService } from './tasks.service';
import { TaskType } from './task.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findByTopic(topicId: string): Promise<import("./task.entity").Task[]>;
    findAllAdmin(): Promise<import("./task.entity").Task[]>;
    search(query: string): Promise<import("./task.entity").Task[]>;
    findById(id: string): Promise<import("./task.entity").Task>;
    create(body: {
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
    }): Promise<import("./task.entity").Task>;
    update(id: string, body: any): Promise<import("./task.entity").Task>;
    delete(id: string): Promise<void>;
}
