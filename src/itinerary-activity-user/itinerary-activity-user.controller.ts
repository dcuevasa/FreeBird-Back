
import { Controller, Delete, Get, HttpCode, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryActivityUserService } from './itinerary-activity-user.service';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itinerary-activity')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryActivityUserController {
    constructor(private readonly itineraryActivityUserService: ItineraryActivityUserService) {}

    @UseGuards(JwtAuthGuard)
    @Put(':itineraryActivityID/addedBy/:userID')
    async associateUserToItineraryActivity(@Param('itineraryActivityID') itineraryActivityID: string, @Param('userID') userID: string): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityUserService.associateUserToItineraryActivity(itineraryActivityID, userID);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':itineraryActivityID/addedBy')
    async findUseryItineraryActivityID(@Param('itineraryActivityID') itineraryID: string): Promise<UserEntity> {
        return await this.itineraryActivityUserService.getUserByItineraryActivityId(itineraryID);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':itineraryActivityID/addedBy')
    @HttpCode(204)
    async deleteUserFromItineraryActivity(@Param('itineraryActivityID') itineraryID: string): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityUserService.deleteUserFromItineraryActivity(itineraryID);
    }
}
