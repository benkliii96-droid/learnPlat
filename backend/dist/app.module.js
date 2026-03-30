"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const topics_module_1 = require("./topics/topics.module");
const tasks_module_1 = require("./tasks/tasks.module");
const submissions_module_1 = require("./submissions/submissions.module");
const progress_module_1 = require("./progress/progress.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'code_learning',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: process.env.NODE_ENV !== 'production',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                signOptions: { expiresIn: '7d' },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            topics_module_1.TopicsModule,
            tasks_module_1.TasksModule,
            submissions_module_1.SubmissionsModule,
            progress_module_1.ProgressModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map