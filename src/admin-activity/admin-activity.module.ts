import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { AdminEntity } from '../admin/admin.entity';
import { AdminActivityService } from './admin-activity.service';
import { AdminActivityController } from './admin-activity.controller';

@Module({
  providers: [AdminActivityService],
  imports: [TypeOrmModule.forFeature([AdminEntity, ActivityEntity])],
  controllers: [AdminActivityController],
})
export class AdminActivityModule {}