import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ActivityItineraryActivityService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityRepository: Repository<ActivityEntity>,
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryActivityRepository: Repository<ItineraryActivityEntity>,
    ) {}

    async addItineraryActivityToActivity(idActivity: string, idItineraryActivity: string): Promise<ActivityEntity> {
        const activity: ActivityEntity = await this.activityRepository.findOne({
            where: { id: idActivity },
            relations: ['itineraryActivities']
        });

        if (!activity)
            throw new BusinessLogicException('The activity with the given id was not found', BusinessError.NOT_FOUND);

        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({
            where: { id: idItineraryActivity }
        });

        if (!itineraryActivity)
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);

        if (activity.itineraryActivities.find(ia => ia.id === itineraryActivity.id))
            throw new BusinessLogicException('The activity already has this itinerary activity', BusinessError.PRECONDITION_FAILED);

        activity.itineraryActivities = [...activity.itineraryActivities, itineraryActivity];
        return await this.activityRepository.save(activity);
    }

    async findItineraryActivitiesByActivityId(idActivity: string): Promise<ItineraryActivityEntity[]> {
        const activity: ActivityEntity = await this.activityRepository.findOne({
            where: { id: idActivity },
            relations: ['itineraryActivities']
        });

        if (!activity)
            throw new BusinessLogicException('The activity with the given id was not found', BusinessError.NOT_FOUND);

        return activity.itineraryActivities;
    }

    async deleteItineraryActivityFromActivity(idActivity: string, idItineraryActivity: string): Promise<ActivityEntity> {
        const activity: ActivityEntity = await this.activityRepository.findOne({
            where: { id: idActivity },
            relations: ['itineraryActivities']
        });

        if (!activity)
            throw new BusinessLogicException('The activity with the given id was not found', BusinessError.NOT_FOUND);

        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({
            where: { id: idItineraryActivity }
        });

        if (!itineraryActivity)
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);

        activity.itineraryActivities = activity.itineraryActivities.filter(ia => ia.id !== idItineraryActivity);
        return await this.activityRepository.save(activity);
    }
}
