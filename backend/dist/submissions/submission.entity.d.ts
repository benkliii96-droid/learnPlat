import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
export declare enum SubmissionStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Submission {
    id: string;
    user: User;
    userId: string;
    task: Task;
    taskId: string;
    code: string;
    solutionText: string;
    filePath: string;
    status: SubmissionStatus;
    points: number;
    testResults: string;
    adminComment: string;
    createdAt: Date;
}
