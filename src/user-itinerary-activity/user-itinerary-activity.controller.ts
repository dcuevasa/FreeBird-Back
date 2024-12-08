import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryActivityDto } from '../itinerary-activity/itinerary-activity.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserItineraryActivityService } from './user-itinerary-activity.service';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserItineraryActivityController {
    constructor(private readonly userItineraryActivityService: UserItineraryActivityService){}

    @Post(':userId/itineraryActivities/:itineraryActivitiesId')
    async addUserItineraryActivity(@Param('userId') userId: string, @Param('itineraryActivityId') itineraryActivityId: string){
        return await this.userItineraryActivityService.addUserItineraryActivity(userId, itineraryActivityId);
    }

    @Get(':userId/itineraryActivities/:itineraryActivitiesId')
    async findItineraryActivityByUserIdItineraryActivityId(@Param('userId') userId: string, @Param('itineraryActivitiesId') itineraryActivitiesId: string){
        return await this.userItineraryActivityService.findItineraryActivityByUserIdItineraryActivityId(userId, itineraryActivitiesId);
    }

    @Get(':userId/itineraryActivities')
    async findItineraryActivitysByUserId(@Param('userId') userId: string){
        return await this.userItineraryActivityService.findItineraryActivitysByUserId(userId);
    }

    @Put(':userId/itineraryActivities')
    async associateItineraryActivitysUser(@Body() itineraryActivityDto: ItineraryActivityDto[], @Param('userId') userId: string){
        const itineraryActivities = plainToInstance(ItineraryActivityEntity, itineraryActivityDto)
        return await this.userItineraryActivityService.associateItineraryActivitysUser(userId, itineraryActivities);
    }
    
    @Delete(':userId/itineraryActivities/:itineraryActivitiesId')
    @HttpCode(204)
    async deleteUserItineraryActivity(@Param('userId') userId: string, @Param('itineraryActivitiesId') itineraryActivitiesId: string){
        return await this.userItineraryActivityService.deleteUserItineraryActivity(userId, itineraryActivitiesId);
    }
}