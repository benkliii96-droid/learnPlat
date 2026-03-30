import { Topic } from '../topics/topic.entity';
import { Submission } from '../submissions/submission.entity';
export declare enum TaskType {
    AUTO = "auto",
    MANUAL = "manual"
}
export declare class Task {
    id: string;
    name: string;
    description: string;
    type: TaskType;
    starterCode: string;
    tests: any;
    solution: string;
    criteria: string;
    maxPoints: number;
    isRequired: boolean;
    isPublished: boolean;
    topic: Topic;
    topicId: string;
    submissions: Submission[];
    createdAt: Date;
    updatedAt: Date;
}
