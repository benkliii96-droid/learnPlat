import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { UsersService } from '../users/users.service';
export declare class SubmissionsService {
    private submissionsRepository;
    private usersService;
    constructor(submissionsRepository: Repository<Submission>, usersService: UsersService);
    create(userId: string, taskId: string, code?: string, solutionText?: string, filePath?: string): Promise<Submission>;
    findByUser(userId: string): Promise<Submission[]>;
    findByTask(taskId: string): Promise<Submission[]>;
    findPending(): Promise<Submission[]>;
    findById(id: string): Promise<Submission>;
    approve(id: string, points: number, comment: string): Promise<Submission>;
    reject(id: string, comment: string): Promise<Submission>;
    runAutoTest(submissionId: string): Promise<{
        passed: boolean;
        results: any;
    }>;
    private runTests;
    getUserSubmissionsByTask(userId: string, taskId: string): Promise<Submission[]>;
    isTaskCompleted(userId: string, taskId: string): Promise<boolean>;
}
