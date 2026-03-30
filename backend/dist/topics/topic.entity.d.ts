import { Course } from '../courses/course.entity';
import { Task } from '../tasks/task.entity';
export declare class Topic {
    id: string;
    name: string;
    content: string;
    order: number;
    isPublished: boolean;
    course: Course;
    courseId: string;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
