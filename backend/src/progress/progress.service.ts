import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from '../entities/user-progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private progressRepository: Repository<UserProgress>,
  ) {}

  async findByUser(userId: string): Promise<UserProgress> {
    let progress = await this.progressRepository.findOne({
      where: { userId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        totalForms: 15,
        completedForms: 0,
        startedAt: new Date(),
        lastActivity: new Date(),
      });
      await this.progressRepository.save(progress);
    }

    return progress;
  }
}
