import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), UsersModule, TasksModule, ProgressModule],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
