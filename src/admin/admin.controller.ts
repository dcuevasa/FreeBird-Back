
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AdminDTO } from './admin.dto';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admins')
@UseInterceptors(BusinessErrorsInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':adminId')
  async findOne(@Param('adminId') adminId: string) {
    return await this.adminService.findOne(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() adminDto: AdminDTO) {
    const admin: AdminEntity = plainToInstance(AdminEntity, adminDto);
    return await this.adminService.create(admin);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':adminId')
  async update(@Param('adminId') adminId: string, @Body() adminDto: AdminDTO) {
    const admin: AdminEntity = plainToInstance(AdminEntity, adminDto);
    return await this.adminService.update(adminId, admin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':adminId')
  @HttpCode(204)
  async delete(@Param('adminId') adminId: string) {
    return await this.adminService.delete(adminId);
  }
}
