import { Controller, Get, Param, UseGuards, Request, Post } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  async getCourseProgress(@Request() req, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(req.user.userId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('overall')
  async getOverallProgress(@Request() req) {
    return this.progressService.getOverallProgress(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-topics/:courseId')
  async updateTopicsProgress(@Request() req, @Param('courseId') courseId: string) {
    const completedTopics = await this.progressService.updateTopicsProgress(req.user.userId, courseId);
    return { completedTopics };
  }
}
