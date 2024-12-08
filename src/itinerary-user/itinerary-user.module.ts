import { Module } from '@nestjs/common';
import { ItineraryUserService } from './itinerary-user.service';
import { ItineraryUserController } from './itinerary-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  providers: [ItineraryUserService],
  controllers: [ItineraryUserController],
  imports: [TypeOrmModule.forFeature([ItineraryEntity, UserEntity])],
})
export class ItineraryUserModule {}
