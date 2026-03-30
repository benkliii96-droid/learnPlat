import { UsersService } from './users.service';
import { UserRole } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        completedTopics: number;
        completedTasks: number;
        totalPoints: number;
        id: string;
        email: string;
        name: string;
        role: UserRole;
    }>;
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    getStats(req: any): Promise<{
        completedTopics: number;
        completedTasks: number;
        totalPoints: number;
    }>;
    getLeaderboard(): Promise<{
        id: string;
        name: string;
        totalPoints: number;
        completedTasks: number;
        completedTopics: number;
    }[]>;
}
