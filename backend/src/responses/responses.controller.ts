import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('responses')
@UseGuards(JwtAuthGuard)
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.responsesService.findByUser(userId);
  }

  @Get('user/:userId/form/:formNumber')
  async findByUserAndForm(
    @Param('userId') userId: string,
    @Param('formNumber', ParseIntPipe) formNumber: number,
  ) {
    const response = await this.responsesService.findByUserAndForm(userId, formNumber);
    if (!response) {
      return null;
    }
    return {
      ...response,
      formData: JSON.parse(response.formData),
    };
  }

  @Post()
  async create(
    @Request() req,
    @Body() createDto: { form_id?: number; form_number?: number; form_data: any; status?: string },
  ) {
    // Aceptar form_id o form_number
    const formIdentifier = createDto.form_id || createDto.form_number;
    if (!formIdentifier) {
      throw new Error('Se requiere form_id o form_number');
    }
    const response = await this.responsesService.create(
      req.user.userId,
      formIdentifier,
      createDto.form_data,
      createDto.status || 'draft',
    );
    return {
      ...response,
      formData: JSON.parse(response.formData),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: { form_data: any; status?: string },
  ) {
    const response = await this.responsesService.update(
      id,
      updateDto.form_data,
      updateDto.status,
    );
    return {
      ...response,
      formData: JSON.parse(response.formData),
    };
  }
}
