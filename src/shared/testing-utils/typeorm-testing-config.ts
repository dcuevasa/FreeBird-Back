
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../../activity/activity.entity';
import { AdminEntity } from '../../admin/admin.entity';
import { ItineraryEntity } from '../../itinerary/itinerary.entity';
import { ItineraryActivityEntity } from '../../itinerary-activity/itinerary-activity.entity';
import { UserEntity } from '../../user/user.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ItineraryEntity, ActivityEntity, ItineraryActivityEntity, UserEntity, AdminEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ItineraryEntity, ActivityEntity, ItineraryActivityEntity, UserEntity, AdminEntity]),
];