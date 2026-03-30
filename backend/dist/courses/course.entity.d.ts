import { Topic } from '../topics/topic.entity';
export declare class Course {
    id: string;
    name: string;
    description: string;
    order: number;
    isPublished: boolean;
    topics: Topic[];
    createdAt: Date;
    updatedAt: Date;
}
