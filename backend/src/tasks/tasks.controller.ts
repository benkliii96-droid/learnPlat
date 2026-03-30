import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TaskType } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('topic/:topicId')
  async findByTopic(@Param('topicId') topicId: string) {
    return this.tasksService.findByTopic(topicId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllAdmin() {
    return this.tasksService.findAllAdmin();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.tasksService.search(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: {
    topicId: string;
    name: string;
    description: string;
    type: TaskType;
    starterCode?: string;
    tests?: any;
    solution?: string;
    criteria?: string;
    maxPoints?: number;
    isRequired?: boolean;
  }) {
    return this.tasksService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
