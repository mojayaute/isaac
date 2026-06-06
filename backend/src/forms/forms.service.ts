import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async findAll(): Promise<Form[]> {
    return this.formRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Form> {
    const form = await this.formRepository.findOne({ where: { id } });
    if (!form) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }
    return form;
  }

  async findByFormNumber(formNumber: number): Promise<Form> {
    const form = await this.formRepository.findOne({ where: { formNumber } });
    if (!form) {
      throw new NotFoundException(`Formulario número ${formNumber} no encontrado`);
    }
    return form;
  }
}
