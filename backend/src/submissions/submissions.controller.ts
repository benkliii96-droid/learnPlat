import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SubmissionStatus } from './submission.entity';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() body: { taskId: string; code?: string; solutionText?: string },
  ) {
    return this.submissionsService.create(
      req.user.userId,
      body.taskId,
      body.code,
      body.solutionText,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMySubmissions(@Request() req) {
    return this.submissionsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('task/:taskId')
  async findByTask(@Param('taskId') taskId: string) {
    return this.submissionsService.findByTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('task/:taskId/my')
  async getMySubmissionsByTask(@Request() req, @Param('taskId') taskId: string) {
    return this.submissionsService.getUserSubmissionsByTask(req.user.userId, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('task/:taskId/completed')
  async isTaskCompleted(@Request() req, @Param('taskId') taskId: string) {
    const completed = await this.submissionsService.isTaskCompleted(req.user.userId, taskId);
    return { completed };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('pending')
  async findPending() {
    return this.submissionsService.findPending();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.submissionsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/run')
  async runAutoTest(@Param('id') id: string) {
    return this.submissionsService.runAutoTest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() body: { points: number; comment: string },
  ) {
    return this.submissionsService.approve(id, body.points, body.comment);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() body: { comment: string },
  ) {
    return this.submissionsService.reject(id, body.comment);
  }
}
