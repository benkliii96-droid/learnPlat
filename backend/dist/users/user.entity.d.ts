import { Submission } from '../submissions/submission.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    totalPoints: number;
    completedTopics: number;
    completedTasks: number;
    createdAt: Date;
    updatedAt: Date;
    submissions: Submission[];
}
