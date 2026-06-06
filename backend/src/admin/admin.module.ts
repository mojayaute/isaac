import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';
import { UserResponse } from '../entities/user-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserResponse])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
