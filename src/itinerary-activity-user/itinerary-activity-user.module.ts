
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryActivityUserService } from './itinerary-activity-user.service';
import { ItineraryActivityUserController } from './itinerary-activity-user.controller';
import { UserEntity } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ItineraryActivityEntity, UserEntity])],
    providers: [ItineraryActivityUserService],
    controllers: [ItineraryActivityUserController]
})
export class ItineraryActivityUserModule {}
