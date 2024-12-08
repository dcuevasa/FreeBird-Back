import { Module } from '@nestjs/common';
import { UserItineraryActivityService } from './user-itinerary-activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { UserItineraryActivityController } from './user-itinerary-activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ItineraryActivityEntity])],
  providers: [UserItineraryActivityService],
  controllers: [UserItineraryActivityController]
})
export class UserItineraryActivityModule {}
