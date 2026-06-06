import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserResponse } from '../entities/user-response.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserResponse)
    private responseRepository: Repository<UserResponse>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'fullName', 'role', 'isActive', 'createdAt', 'lastLogin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserResponses(userId: string): Promise<UserResponse[]> {
    return this.responseRepository.find({
      where: { userId },
      relations: ['form'],
      order: { createdAt: 'DESC' },
    });
  }
}
