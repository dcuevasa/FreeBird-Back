import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../admin/admin.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AdminActivityService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

  async addActivityToAdmin(adminId: string, activityId: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId }, relations: ['activities'] });
    if (!admin) {
      throw new BusinessLogicException('The admin with the given ID was not found', BusinessError.NOT_FOUND);
    }

    const activity = await this.activityRepository.findOne({ where: { id: activityId } });
    if (!activity) {
      throw new BusinessLogicException('The activity with the given ID was not found', BusinessError.NOT_FOUND);
    }

    admin.activities = [...admin.activities, activity];
    return await this.adminRepository.save(admin);
  }

  async findActivitiesByAdminId(adminId: string): Promise<ActivityEntity[]> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId }, relations: ['activities'] });
    if (!admin) {
      throw new BusinessLogicException('The admin with the given ID was not found', BusinessError.NOT_FOUND);
    }

    return admin.activities;
  }

  async associateActivitiesToAdmin(adminId: string, activities: ActivityEntity[]): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId }, relations: ['activities'] });
    if (!admin) {
      throw new BusinessLogicException('The admin with the given ID was not found', BusinessError.NOT_FOUND);
    }

    for (const activity of activities) {
      const foundActivity = await this.activityRepository.findOne({ where: { id: activity.id } });
      if (!foundActivity) {
        throw new BusinessLogicException(
          `The activity with ID ${activity.id} was not found`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    admin.activities = activities;
    return await this.adminRepository.save(admin);
  }

  async deleteActivityFromAdmin(adminId: string, activityId: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId }, relations: ['activities'] });
    if (!admin) {
      throw new BusinessLogicException('The admin with the given ID was not found', BusinessError.NOT_FOUND);
    }

    const activity = admin.activities.find((activity) => activity.id === activityId);
    if (!activity) {
      throw new BusinessLogicException(
        'The activity with the given ID is not associated with the admin',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    admin.activities = admin.activities.filter((activity) => activity.id !== activityId);
    await this.adminRepository.save(admin);
  }
}
