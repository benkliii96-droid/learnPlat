import { TopicsService } from './topics.service';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    findByCourse(courseId: string): Promise<import("./topic.entity").Topic[]>;
    findAllAdmin(): Promise<import("./topic.entity").Topic[]>;
    findById(id: string): Promise<import("./topic.entity").Topic>;
    create(body: {
        courseId: string;
        name: string;
        content: string;
        order: number;
    }): Promise<import("./topic.entity").Topic>;
    update(id: string, body: {
        name?: string;
        content?: string;
        order?: number;
        isPublished?: boolean;
    }): Promise<import("./topic.entity").Topic>;
    delete(id: string): Promise<void>;
}
