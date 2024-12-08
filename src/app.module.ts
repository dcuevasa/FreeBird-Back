
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './activity/activity.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ItineraryActivityModule } from './itinerary-activity/itinerary-activity.module';
import { UserModule } from './user/user.module';
import { ActivityEntity } from './activity/activity.entity';
import { AdminEntity } from './admin/admin.entity';
import { ItineraryEntity } from './itinerary/itinerary.entity';
import { ItineraryActivityEntity } from './itinerary-activity/itinerary-activity.entity';
import { UserEntity } from './user/user.entity';
import { ItineraryActivityActivityModule } from './itinerary-activity-activity/itinerary-activity-activity.module';
import { ItineraryActivityUserModule } from './itinerary-activity-user/itinerary-activity-user.module';
import { ItineraryItineraryActivityModule } from './itinerary-itinerary-activity/itinerary-itinerary-activity.module';
import { AuthModule } from './auth/auth.module';
import { UserItineraryModule } from './user-itinerary/user-itinerary.module';
import { UserItineraryActivityModule } from './user-itinerary-activity/user-itinerary-activity.module';
import { ActivityItineraryActivityModule } from './activity-itinerary-activity/activity-itinerary-activity.module';
import { ItineraryUserModule } from './itinerary-user/itinerary-user.module';
import { ItineraryActivityItineraryModule } from './itinerary-activity-itinerary/itinerary-activity-itinerary.module';

@Module({
  imports: [
    ActivityModule,
    AdminModule,
    ItineraryModule,
    ItineraryActivityModule,
    UserModule,
    ItineraryActivityActivityModule,
    ItineraryActivityUserModule,
    ItineraryItineraryActivityModule,
    UserItineraryModule,
    UserItineraryActivityModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'freebird',
      entities: [
        ActivityEntity,
        AdminEntity,
        ItineraryEntity,
        ItineraryActivityEntity,
        UserEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ItineraryActivityActivityModule,
    ItineraryActivityUserModule,
    ItineraryItineraryActivityModule,
    AuthModule,
    UserItineraryModule,
    UserItineraryActivityModule,
    ActivityItineraryActivityModule,
    ItineraryUserModule,
    ItineraryActivityItineraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
