import { Module } from '@nestjs/common';
import { UserItineraryService } from './user-itinerary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ItineraryEntity])],
  providers: [UserItineraryService]
})
export class UserItineraryModule {}
