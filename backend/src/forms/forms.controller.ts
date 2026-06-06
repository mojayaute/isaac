import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.findOne(id);
  }

  @Get('number/:formNumber')
  async findByFormNumber(@Param('formNumber', ParseIntPipe) formNumber: number) {
    return this.formsService.findByFormNumber(formNumber);
  }
}
