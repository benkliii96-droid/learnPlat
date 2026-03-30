import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { TopicsModule } from './topics/topics.module';
import { TasksModule } from './tasks/tasks.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'code_learning',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // В продакшене использовать миграции
      logging: process.env.NODE_ENV !== 'production',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    TopicsModule,
    TasksModule,
    SubmissionsModule,
    ProgressModule,
  ],
})
export class AppModule {}
