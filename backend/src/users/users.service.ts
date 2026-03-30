import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, name: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  async getStats(userId: string): Promise<{ completedTopics: number; completedTasks: number; totalPoints: number }> {
    const user = await this.findById(userId);
    return {
      completedTopics: user.completedTopics,
      completedTasks: user.completedTasks,
      totalPoints: user.totalPoints,
    };
  }

  async updateStats(userId: string, points: number): Promise<void> {
    const user = await this.findById(userId);
    await this.usersRepository.update(userId, {
      totalPoints: user.totalPoints + points,
    });
  }

  async incrementCompletedTopics(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.usersRepository.update(userId, {
      completedTopics: user.completedTopics + 1,
    });
  }

  async incrementCompletedTasks(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.usersRepository.update(userId, {
      completedTasks: user.completedTasks + 1,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createAdmin(email: string, name: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    return this.usersRepository.save(user);
  }
}
