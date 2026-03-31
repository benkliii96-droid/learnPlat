import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getCourseProgress(req: any, courseId: string): Promise<any>;
    getOverallProgress(req: any): Promise<any>;
    updateTopicsProgress(req: any, courseId: string): Promise<{
        completedTopics: number;
    }>;
}
