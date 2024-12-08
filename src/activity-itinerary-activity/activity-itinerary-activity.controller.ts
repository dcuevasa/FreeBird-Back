import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActivityItineraryActivityService } from './activity-itinerary-activity.service';
import { ActivityEntity } from '../activity/activity.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activities')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActivityItineraryActivityController {
    constructor(
        private readonly activityItineraryActivityService: ActivityItineraryActivityService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':activityId/itinerary-activities/:itineraryActivityId')
    async addItineraryActivityToActivity(
        @Param('activityId') activityId: string,
        @Param('itineraryActivityId') itineraryActivityId: string
    ): Promise<ActivityEntity> {
        return await this.activityItineraryActivityService.addItineraryActivityToActivity(activityId, itineraryActivityId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':activityId/itinerary-activities')
    async findItineraryActivitiesByActivityId(
        @Param('activityId') activityId: string
    ): Promise<ItineraryActivityEntity[]> {
        return await this.activityItineraryActivityService.findItineraryActivitiesByActivityId(activityId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':activityId/itinerary-activities/:itineraryActivityId')
    @HttpCode(204)
    async deleteItineraryActivityFromActivity(
        @Param('activityId') activityId: string,
        @Param('itineraryActivityId') itineraryActivityId: string
    ): Promise<ActivityEntity> {
        return await this.activityItineraryActivityService.deleteItineraryActivityFromActivity(activityId, itineraryActivityId);
    }
}
