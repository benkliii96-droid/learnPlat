import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<import("./course.entity").Course[]>;
    findAllAdmin(): Promise<import("./course.entity").Course[]>;
    findById(id: string): Promise<import("./course.entity").Course>;
    getAllWithProgress(req: any): Promise<any[]>;
    create(body: {
        name: string;
        description: string;
        order: number;
    }): Promise<import("./course.entity").Course>;
    update(id: string, body: {
        name?: string;
        description?: string;
        order?: number;
        isPublished?: boolean;
    }): Promise<import("./course.entity").Course>;
    delete(id: string): Promise<void>;
}
