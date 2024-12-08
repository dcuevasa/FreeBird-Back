import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityEntity } from './activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ActivityService],
  controllers: [ActivityController],
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
})
export class ActivityModule {}
