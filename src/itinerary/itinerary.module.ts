
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryService } from './itinerary.service';
import { ItineraryEntity } from './itinerary.entity';
import { ItineraryController } from './itinerary.controller';
import { ItineraryActivityController } from '../itinerary-activity/itinerary-activity.controller';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryActivityService } from '../itinerary-activity/itinerary-activity.service';

@Module({
    imports: [TypeOrmModule.forFeature([ItineraryEntity, ItineraryActivityEntity])],
    providers: [ItineraryService, ItineraryActivityService],
    controllers: [ItineraryController, ItineraryActivityController],
})
export class ItineraryModule {}
