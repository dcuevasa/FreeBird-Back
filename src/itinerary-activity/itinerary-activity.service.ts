
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItineraryActivityEntity } from './itinerary-activity.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ItineraryEntity } from '../itinerary/itinerary.entity';

@Injectable()
export class ItineraryActivityService {
    constructor (
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryactivityRepository: Repository<ItineraryActivityEntity>,

        @InjectRepository(ItineraryEntity)
        private readonly itineraryRepository: Repository<ItineraryEntity>

    ) {}

    async findAll(): Promise<ItineraryActivityEntity[]> {
        return await this.itineraryactivityRepository.find({relations: ['itinerary', 'activity', 'addedBy']});
    }

    async findOne(id: string): Promise<ItineraryActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({where: {id}, relations: ['itinerary', 'activity', 'addedBy']});
        if (!itineraryactivity)
            throw new BusinessLogicException('The itineraryactivity with the given id was not found', BusinessError.NOT_FOUND);

        return itineraryactivity;
    }

    async create(itineraryactivity: ItineraryActivityEntity): Promise<ItineraryActivityEntity> {
        return await this.itineraryactivityRepository.save(itineraryactivity);
    }

    async update(id: string, itineraryactivity: ItineraryActivityEntity): Promise<ItineraryActivityEntity> {
        const persistedItineraryActivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({where: {id}, relations: ['itinerary', 'activity', 'addedBy']});
        if (!persistedItineraryActivity)
            throw new BusinessLogicException('The itineraryactivity with the given id was not found', BusinessError.NOT_FOUND);

        if (itineraryactivity.itinerary){
            const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryactivity.itinerary.id}, relations: ['itineraryActivities']});
            if (itinerary){
                const filteredActivities = itinerary.itineraryActivities.filter(activity => activity.id !== id);
                if (await this.hasConflict(filteredActivities, itineraryactivity)){
                    throw new BusinessLogicException('The itinerary activity has a conflict with another itinerary activity', BusinessError.PRECONDITION_FAILED);
                }
            }
        }

        return await this.itineraryactivityRepository.save({...persistedItineraryActivity, ...itineraryactivity});
    }

    async hasConflict(itineraryActivities: ItineraryActivityEntity[], itineraryActivity: ItineraryActivityEntity): Promise<boolean> {
        const [hoursA, minutesA] = itineraryActivity.time.split(':').map(Number);
        const startTimeA = hoursA * 60 + minutesA;
        const endTimeA = startTimeA + itineraryActivity.activity.durationMins; 

        for (let i = 0; i < itineraryActivities.length; i++) {
            if (itineraryActivity.date.getDate() == itineraryActivities[i].date.getDate()) {
                const actIA = await this.itineraryactivityRepository.findOne({where: {id: itineraryActivities[i].id}, relations: ['activity']});
                const [hoursB, minutesB] = actIA.time.split(':').map(Number);
                const startTimeB = hoursB * 60 + minutesB;
                const endTimeB = startTimeB + actIA.activity.durationMins;

                if ((startTimeA < endTimeB && startTimeA >= startTimeB) || (startTimeB < endTimeA && startTimeB >= startTimeA)) {
                    return true;
                }
            }
        }
        return false;
    }

    async delete(id: string) {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({where: {id}});
        if (!itineraryactivity)
            throw new BusinessLogicException('The itineraryactivity with the given id was not found', BusinessError.NOT_FOUND);

        await this.itineraryactivityRepository.remove(itineraryactivity);
    }
}
