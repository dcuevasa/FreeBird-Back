

import { Module } from '@nestjs/common';
import { ItineraryItineraryActivityService } from './itinerary-itinerary-activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryItineraryActivityController } from './itinerary-itinerary-activity.controller';

@Module({
  providers: [ItineraryItineraryActivityService],
  imports: [TypeOrmModule.forFeature([ItineraryEntity, ItineraryActivityEntity])],
  controllers: [ItineraryItineraryActivityController]
})
export class ItineraryItineraryActivityModule {}
