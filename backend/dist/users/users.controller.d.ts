import { UsersService } from './users.service';
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
        role: import("./user.entity").UserRole;
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
}
