
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryItineraryActivityService } from './itinerary-itinerary-activity.service';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itinerary')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryItineraryActivityController {
    constructor(private readonly itineraryItineraryActivityService: ItineraryItineraryActivityService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':itineraryID/itinerary-activity/:itineraryActivityID')
    async addActivityItineraryToItinerary(@Param('itineraryID') itineraryID: string, @Param('itineraryActivityID') itineraryActivityID: string): Promise<ItineraryEntity> {
        return await this.itineraryItineraryActivityService.addActivityItineraryToItinerary(itineraryID, itineraryActivityID);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':itineraryID/itinerary-activity/:itineraryActivityID')
    async findItineraryActivityByItineraryIDItineraryActivityID(@Param('itineraryID') itineraryID: string, @Param('itineraryActivityID') itineraryActivityID: string): Promise<ItineraryActivityEntity> {
        return await this.itineraryItineraryActivityService.findItineraryActivityByItineraryIDItineraryActivityID(itineraryID, itineraryActivityID);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':itineraryID/itinerary-activity')
    async findItineraryActivitiesByItineraryID(@Param('itineraryID') itineraryID: string): Promise<ItineraryActivityEntity[]> {
        return await this.itineraryItineraryActivityService.findItineraryActivitiesByItineraryID(itineraryID);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':itineraryID/itinerary-activity')
    async associateItineraryActivitiesToItinerary(@Body() itineraryActivities: ItineraryActivityEntity[], @Param('itineraryID') itineraryID: string): Promise<ItineraryEntity> {
        return await this.itineraryItineraryActivityService.associateItineraryActivitiesToItinerary(itineraryID, itineraryActivities);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':itineraryID/itinerary-activity/:itineraryActivityID')
    @HttpCode(204)
    async deleteActivityFromItinerary(@Param('itineraryID') itineraryID: string, @Param('itineraryActivityID') itineraryActivityID: string): Promise<ItineraryEntity> {
        return await this.itineraryItineraryActivityService.deleteItineraryActivityFromItinerary(itineraryID, itineraryActivityID);
    }
}
