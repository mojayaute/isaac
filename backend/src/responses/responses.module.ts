import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { UserResponse } from '../entities/user-response.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { Form } from '../entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserResponse, UserProgress, Form])],
  controllers: [ResponsesController],
  providers: [ResponsesService],
  exports: [ResponsesService],
})
export class ResponsesModule {}
