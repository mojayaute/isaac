import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:userId/responses')
  async getUserResponses(@Param('userId') userId: string) {
    const responses = await this.adminService.getUserResponses(userId);
    return responses.map((r) => ({
      ...r,
      formData: JSON.parse(r.formData),
    }));
  }
}
