import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryActivityItineraryService } from './itinerary-activity-itinerary.service';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itinerary-activity')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryActivityItineraryController {
    constructor(
        private readonly itineraryActivityItineraryService: ItineraryActivityItineraryService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':itineraryActivityId/itinerary/:itineraryId')
    async associateItineraryToItineraryActivity(
        @Param('itineraryActivityId') itineraryActivityId: string,
        @Param('itineraryId') itineraryId: string
    ): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityItineraryService.associateItineraryToItineraryActivity(itineraryActivityId, itineraryId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':itineraryActivityId/itinerary')
    async findItineraryByItineraryActivityId(
        @Param('itineraryActivityId') itineraryActivityId: string
    ): Promise<ItineraryEntity> {
        return await this.itineraryActivityItineraryService.getItineraryByItineraryActivityId(itineraryActivityId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':itineraryActivityId/itinerary')
    @HttpCode(204)
    async deleteItineraryFromItineraryActivity(
        @Param('itineraryActivityId') itineraryActivityId: string
    ): Promise<ItineraryActivityEntity> {
        return await this.itineraryActivityItineraryService.deleteItineraryFromItineraryActivity(itineraryActivityId);
    }
}
