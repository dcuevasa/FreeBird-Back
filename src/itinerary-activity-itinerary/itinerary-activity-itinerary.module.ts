import { Module } from '@nestjs/common';
import { ItineraryActivityItineraryService } from './itinerary-activity-itinerary.service';
import { ItineraryActivityItineraryController } from './itinerary-activity-itinerary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';

@Module({
  providers: [ItineraryActivityItineraryService],
  controllers: [ItineraryActivityItineraryController],
  imports: [TypeOrmModule.forFeature([ItineraryActivityEntity, ItineraryEntity])],
})
export class ItineraryActivityItineraryModule {}
