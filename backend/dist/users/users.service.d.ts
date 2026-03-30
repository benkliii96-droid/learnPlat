import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(email: string, name: string, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
    getStats(userId: string): Promise<{
        completedTopics: number;
        completedTasks: number;
        totalPoints: number;
    }>;
    updateStats(userId: string, points: number): Promise<void>;
    incrementCompletedTopics(userId: string): Promise<void>;
    incrementCompletedTasks(userId: string): Promise<void>;
    findAll(): Promise<User[]>;
    createAdmin(email: string, name: string, password: string): Promise<User>;
}
