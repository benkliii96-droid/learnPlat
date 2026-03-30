import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
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
}
