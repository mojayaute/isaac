import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponse } from '../entities/user-response.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { Form } from '../entities/form.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(UserResponse)
    private responseRepository: Repository<UserResponse>,
    @InjectRepository(UserProgress)
    private progressRepository: Repository<UserProgress>,
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async findByUser(userId: string): Promise<UserResponse[]> {
    return this.responseRepository.find({
      where: { userId },
      relations: ['form'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndForm(userId: string, formNumber: number): Promise<UserResponse | null> {
    // Buscar el formulario por formNumber para obtener su ID
    const form = await this.formRepository.findOne({ where: { formNumber } });
    if (!form) {
      return null;
    }
    return this.responseRepository.findOne({
      where: { userId, formId: form.id },
      relations: ['form'],
    });
  }

  async create(
    userId: string,
    formNumberOrId: number,
    formData: any,
    status: string = 'draft',
  ): Promise<UserResponse> {
    // Determinar si es formNumber o formId
    let formId: number;
    const form = await this.formRepository.findOne({ 
      where: [{ formNumber: formNumberOrId }, { id: formNumberOrId }] 
    });
    if (!form) {
      throw new NotFoundException(`Formulario no encontrado`);
    }
    formId = form.id;

    const existing = await this.responseRepository.findOne({
      where: { userId, formId },
    });

    if (existing) {
      existing.formData = JSON.stringify(formData);
      existing.status = status;
      if (status === 'submitted' || status === 'completed') {
        existing.submittedAt = new Date();
      } else {
        existing.submittedAt = undefined;
      }
      return this.responseRepository.save(existing);
    }

    const response = this.responseRepository.create({
      id: uuidv4(),
      userId,
      formId,
      formData: JSON.stringify(formData),
      status,
      submittedAt: status !== 'draft' ? new Date() : undefined,
    });

    const saved = await this.responseRepository.save(response);
    await this.updateProgress(userId);
    return saved;
  }

  async update(
    responseId: string,
    formData: any,
    status?: string,
  ): Promise<UserResponse> {
    const response = await this.responseRepository.findOne({
      where: { id: responseId },
    });

    if (!response) {
      throw new NotFoundException('Respuesta no encontrada');
    }

    response.formData = JSON.stringify(formData);
    if (status) {
      response.status = status;
      if (status === 'submitted' || status === 'completed') {
        response.submittedAt = new Date();
      }
    }
    response.version += 1;

    const saved = await this.responseRepository.save(response);
    await this.updateProgress(response.userId);
    return saved;
  }

  private async updateProgress(userId: string) {
    const completedCount = await this.responseRepository.count({
      where: { userId, status: 'completed' },
    });

    let progress = await this.progressRepository.findOne({
      where: { userId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        totalForms: 15,
        completedForms: completedCount,
        lastActivity: new Date(),
        startedAt: new Date(),
      });
    } else {
      progress.completedForms = completedCount;
      progress.lastActivity = new Date();
      if (completedCount === 15 && !progress.completedAt) {
        progress.completedAt = new Date();
      }
    }

    await this.progressRepository.save(progress);
  }
}
