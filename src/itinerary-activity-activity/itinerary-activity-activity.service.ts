
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryActivityActivityService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityRepository: Repository<ActivityEntity>,
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryactivityRepository: Repository<ItineraryActivityEntity>,
    ) {}

    async associateActivityToItineraryActivity(idItineraryActivity: string, idActivity: string): Promise<ItineraryActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity}
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        const activity: ActivityEntity = await this.activityRepository.findOne({
            where: {id: idActivity}
        });

        if (!activity) {
            throw new BusinessLogicException('The activity with the given id was not found', BusinessError.NOT_FOUND);
        }

        itineraryactivity.activity = activity;
        return await this.itineraryactivityRepository.save(itineraryactivity);
    }

    async getActivityByItineraryActivityId(idItineraryActivity: string): Promise<ActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity},
            relations: ['activity'],
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        return itineraryactivity.activity;
    }

    async deleteActivityFromItineraryActivity(idItineraryActivity: string): Promise<ItineraryActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity},
            relations: ['activity'],
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        if (!itineraryactivity.activity) {
            throw new BusinessLogicException('The itineraryActivity does not have an activity associated', BusinessError.NOT_FOUND);
        }

        itineraryactivity.activity = null;
        return await this.itineraryactivityRepository.save(itineraryactivity);
    }
}
