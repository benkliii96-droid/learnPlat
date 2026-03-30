import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllAdmin() {
    return this.coursesService.findAllAdmin();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Get('with-progress/user')
  @UseGuards(JwtAuthGuard)
  async getAllWithProgress(@Request() req) {
    return this.coursesService.getAllWithProgress(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: { name: string; description: string; order: number }) {
    return this.coursesService.create(body.name, body.description, body.order);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string; order?: number; isPublished?: boolean }) {
    return this.coursesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}
