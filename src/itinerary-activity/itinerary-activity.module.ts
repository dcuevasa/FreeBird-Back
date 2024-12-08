
import { Module } from '@nestjs/common';
import { ItineraryActivityController } from './itinerary-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from './itinerary-activity.entity';
import { ItineraryActivityService } from './itinerary-activity.service';
import { ItineraryEntity } from '../itinerary/itinerary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItineraryActivityEntity, ItineraryEntity])],
  providers: [ItineraryActivityService],
  controllers: [ItineraryActivityController]
})
export class ItineraryActivityModule {}
