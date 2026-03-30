import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        name: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    getMe(req: any): Promise<any>;
}
