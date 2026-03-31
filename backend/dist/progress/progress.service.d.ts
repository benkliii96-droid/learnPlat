export declare class ProgressService {
    getCourseProgress(userId: string, courseId: string): Promise<any>;
    getOverallProgress(userId: string): Promise<any>;
    updateTopicsProgress(userId: string, courseId: string): Promise<number>;
}
