/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ActivityItineraryActivityService } from './activity-itinerary-activity.service';
import { ActivityItineraryActivityController } from './activity-itinerary-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity, ItineraryActivityEntity])],
  providers: [ActivityItineraryActivityService],
  controllers: [ActivityItineraryActivityController]
})
export class ActivityItineraryActivityModule {}
