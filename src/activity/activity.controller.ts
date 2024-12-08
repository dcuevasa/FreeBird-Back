import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActivityEntity } from './activity.entity';
import { plainToInstance } from 'class-transformer';
import { ActivityDto } from './activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('activity')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return await this.activityService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.activityService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() activityDto: ActivityDto) {
        const activity: ActivityEntity = plainToInstance(ActivityEntity, activityDto);
        return await this.activityService.create(activity);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() activityDto: ActivityDto) {
        const activity: ActivityEntity = plainToInstance(ActivityEntity, activityDto);
        return await this.activityService.update(id, activity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.activityService.delete(id);
    }
}
