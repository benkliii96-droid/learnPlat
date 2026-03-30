import { SubmissionsService } from './submissions.service';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    create(req: any, body: {
        taskId: string;
        code?: string;
        solutionText?: string;
    }): Promise<import("./submission.entity").Submission>;
    findMySubmissions(req: any): Promise<import("./submission.entity").Submission[]>;
    findByTask(taskId: string): Promise<import("./submission.entity").Submission[]>;
    getMySubmissionsByTask(req: any, taskId: string): Promise<import("./submission.entity").Submission[]>;
    isTaskCompleted(req: any, taskId: string): Promise<{
        completed: boolean;
    }>;
    findPending(): Promise<import("./submission.entity").Submission[]>;
    findById(id: string): Promise<import("./submission.entity").Submission>;
    runAutoTest(id: string): Promise<{
        passed: boolean;
        results: any;
    }>;
    approve(id: string, body: {
        points: number;
        comment: string;
    }): Promise<import("./submission.entity").Submission>;
    reject(id: string, body: {
        comment: string;
    }): Promise<import("./submission.entity").Submission>;
}
