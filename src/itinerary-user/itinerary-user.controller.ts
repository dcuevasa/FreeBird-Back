import { Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryUserService } from './itinerary-user.service';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('itineraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryUserController {
    constructor(
        private readonly itineraryUserService: ItineraryUserService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':itineraryId/users/:userId')
    async addUserToItinerary(
        @Param('itineraryId') itineraryId: string,
        @Param('userId') userId: string
    ): Promise<ItineraryEntity> {
        return await this.itineraryUserService.addUserToItinerary(itineraryId, userId);
    }

    @Get(':itineraryId/users')
    async findUsersByItineraryId(
        @Param('itineraryId') itineraryId: string
    ): Promise<UserEntity[]> {
        return await this.itineraryUserService.findUsersByItineraryId(itineraryId);
    }

    @Delete(':itineraryId/users/:userId')
    @HttpCode(204)
    async deleteUserFromItinerary(
        @Param('itineraryId') itineraryId: string,
        @Param('userId') userId: string
    ): Promise<ItineraryEntity> {
        return await this.itineraryUserService.deleteUserFromItinerary(itineraryId, userId);
    }
}
