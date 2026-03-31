import { TopicsService } from '../topics/topics.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { UsersService } from '../users/users.service';
export declare class ProgressService {
    private topicsService;
    private submissionsService;
    private usersService;
    constructor(topicsService: TopicsService, submissionsService: SubmissionsService, usersService: UsersService);
    getCourseProgress(userId: string, courseId: string): Promise<any>;
    getOverallProgress(userId: string): Promise<any>;
    updateTopicsProgress(userId: string, courseId: string): Promise<number>;
}
