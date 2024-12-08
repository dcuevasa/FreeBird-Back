import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityRepository: Repository<ActivityEntity>
    ) {}

    async findAll(): Promise<ActivityEntity[]> {
        return await this.activityRepository.find({
            relations: ['admin', 'itineraryActivities']
        });
    }

    async findOne(id: string): Promise<ActivityEntity> {
        const activity = await this.activityRepository.findOne({
            where: { id },
            relations: ['admin', 'itineraryActivities']
        });
        if (!activity)
            throw new BusinessLogicException(
                'La actividad con el id dado no fue encontrada',
                BusinessError.NOT_FOUND
            );
        return activity;
    }

    async create(activity: ActivityEntity): Promise<ActivityEntity> {
        if (!activity.name || !activity.durationMins || !activity.addressess)
            throw new BusinessLogicException(
                'La actividad debe tener nombre, duración y dirección',
                BusinessError.PRECONDITION_FAILED
            );
        return await this.activityRepository.save(activity);
    }

    async update(id: string, activity: ActivityEntity): Promise<ActivityEntity> {
        const persistedActivity = await this.activityRepository.findOne({
            where: { id }
        });
        if (!persistedActivity)
            throw new BusinessLogicException(
                'La actividad con el id dado no fue encontrada',
                BusinessError.NOT_FOUND
            );
        
        if (!activity.name || !activity.durationMins || !activity.addressess)
            throw new BusinessLogicException(
                'La actividad debe tener nombre, duración y dirección',
                BusinessError.PRECONDITION_FAILED
            );

        return await this.activityRepository.save({
            ...persistedActivity,
            ...activity
        });
    }

    async delete(id: string) {
        const activity = await this.activityRepository.findOne({
            where: { id }
        });
        if (!activity)
            throw new BusinessLogicException(
                'La actividad con el id dado no fue encontrada',
                BusinessError.NOT_FOUND
            );

        await this.activityRepository.remove(activity);
    }
}
