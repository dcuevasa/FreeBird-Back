
import { Controller, Delete, Get, HttpCode, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryActivityActivityService } from './itinerary-activity-activity.service';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itinerary-activity')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryActivityActivityController {
    constructor(private readonly itineraryActivityActivityService: ItineraryActivityActivityService) {}

    @UseGuards(JwtAuthGuard)
    @Put(':itineraryActivityID/activity/:activityID')
    async associateActivityToItineraryActivity(@Param('itineraryActivityID') itineraryActivityID: string, @Param('activityID') activityID: string): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityActivityService.associateActivityToItineraryActivity(itineraryActivityID, activityID);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':itineraryActivityID/activity')
    async findActivityByItineraryActivityID(@Param('itineraryActivityID') itineraryID: string): Promise<ActivityEntity> {
        return await this.itineraryActivityActivityService.getActivityByItineraryActivityId(itineraryID);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':itineraryActivityID/activity')
    @HttpCode(204)
    async deleteActivityFromItineraryActivity(@Param('itineraryActivityID') itineraryID: string): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityActivityService.deleteActivityFromItineraryActivity(itineraryID);
    }
}
