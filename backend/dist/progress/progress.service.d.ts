export declare class ProgressService {
    constructor();
    getCourseProgress(userId: string, courseId: string): Promise<any>;
    getOverallProgress(userId: string): Promise<any>;
}
