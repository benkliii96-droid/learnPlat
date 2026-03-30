import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.topicsService.findByCourse(courseId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllAdmin() {
    return this.topicsService.findAllAdmin();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.topicsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: { courseId: string; name: string; content: string; order: number }) {
    return this.topicsService.create(body.courseId, body.name, body.content, body.order);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() body: { name?: string; content?: string; order?: number; isPublished?: boolean }) {
    return this.topicsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    return this.topicsService.delete(id);
  }
}
