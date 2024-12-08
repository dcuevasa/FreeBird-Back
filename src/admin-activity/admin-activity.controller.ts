
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActivityEntity } from '../activity/activity.entity';
import { AdminActivityService } from './admin-activity.service';
import { ActivityDto } from '../activity/activity.dto';

@Controller('admins')
@UseInterceptors(BusinessErrorsInterceptor)
export class AdminActivityController {
  constructor(private readonly adminActivityService: AdminActivityService) {}

  @Post(':adminId/activities/:activityId')
  async addActivityToAdmin(
    @Param('adminId') adminId: string,
    @Param('activityId') activityId: string,
  ) {
    return await this.adminActivityService.addActivityToAdmin(adminId, activityId);
  }

  @Get(':adminId/activities')
  async findActivitiesByAdminId(@Param('adminId') adminId: string) {
    return await this.adminActivityService.findActivitiesByAdminId(adminId);
  }

  @Put(':adminId/activities')
  async associateActivitiesToAdmin(
    @Body() activitiesDto: ActivityDto[],
    @Param('adminId') adminId: string,
  ) {
    const activities = plainToInstance(ActivityEntity, activitiesDto);
    return await this.adminActivityService.associateActivitiesToAdmin(adminId, activities);
  }

  @Delete(':adminId/activities/:activityId')
  @HttpCode(204)
  async deleteActivityFromAdmin(
    @Param('adminId') adminId: string,
    @Param('activityId') activityId: string,
  ) {
    return await this.adminActivityService.deleteActivityFromAdmin(adminId, activityId);
  }
}
