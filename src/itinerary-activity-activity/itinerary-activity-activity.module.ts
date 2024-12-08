
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryActivityActivityController } from './itinerary-activity-activity.controller';
import { ItineraryActivityActivityService } from './itinerary-activity-activity.service';
import { ActivityEntity } from '../activity/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ItineraryActivityEntity, ActivityEntity])],
    providers: [ItineraryActivityActivityService],
    controllers: [ItineraryActivityActivityController]
})
export class ItineraryActivityActivityModule {}
