
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryItineraryActivityService {
    constructor(
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryActivityRepository: Repository<ItineraryActivityEntity>,

        @InjectRepository(ItineraryEntity)
        private readonly itineraryRepository: Repository<ItineraryEntity>,
    ){}

    async addActivityItineraryToItinerary(itineraryID: string, activityItineraryID: string): Promise<ItineraryEntity> {
        const  itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: activityItineraryID}, relations: ['activity']});
        if (!itineraryActivity) {
            throw new BusinessLogicException('The itinerary activity with the given id was not found', BusinessError.NOT_FOUND);
        }

        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryID}, relations: ['itineraryActivities']});
        if (!itinerary) {
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);
        }

        // check if the itinerary activity is already associated to the itinerary
        const itineraryActivityFound: ItineraryActivityEntity = itinerary.itineraryActivities.find(itineraryActivity => itineraryActivity.id === activityItineraryID);
        if (itineraryActivityFound) {
            throw new BusinessLogicException('The itinerary activity is already associated to the itinerary', BusinessError.ALREADY_EXISTS);
        }

        if (itineraryActivity.activity === null) {
            throw new BusinessLogicException('The itinerary activity must have an activity associated', BusinessError.PRECONDITION_FAILED);
        }

        if (await this.hasConflict(itinerary.itineraryActivities, itineraryActivity)) {
            throw new BusinessLogicException('The itinerary activity has a conflict with another itinerary activity', BusinessError.PRECONDITION_FAILED);
        }
        
        itinerary.itineraryActivities = [...itinerary.itineraryActivities, itineraryActivity];
        return await this.itineraryRepository.save(itinerary);
    }

    async hasConflict(itineraryActivities: ItineraryActivityEntity[], itineraryActivity: ItineraryActivityEntity): Promise<boolean> {
        const [hoursA, minutesA] = itineraryActivity.time.split(':').map(Number);
        const startTimeA = hoursA * 60 + minutesA;
        const endTimeA = startTimeA + itineraryActivity.activity.durationMins; 

        itineraryActivities = itineraryActivities.filter(act => itineraryActivity.date.getDate() == act.date.getDate());

        for (let i = 0; i < itineraryActivities.length; i++) {
            const actIA = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivities[i].id}, relations: ['activity']});
            const [hoursB, minutesB] = actIA.time.split(':').map(Number);
            const startTimeB = hoursB * 60 + minutesB;
            const endTimeB = startTimeB + actIA.activity.durationMins;

            if ((startTimeA < endTimeB && startTimeA >= startTimeB) || (startTimeB < endTimeA && startTimeB >= startTimeA)) {
                return true;
            }
        }
        return false;
    }
    

    async findItineraryActivityByItineraryIDItineraryActivityID(itineraryID: string, itineraryActivityID: string): Promise<ItineraryActivityEntity> {
        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivityID}, relations: ['activity', 'itinerary', 'addedBy']});
        if (!itineraryActivity) {
            throw new BusinessLogicException('The itinerary activity with the given id was not found', BusinessError.NOT_FOUND);
        }

        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryID}, relations: ['itineraryActivities']});
        if (!itinerary) {
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);
        }

        const itineraryActivityFound: ItineraryActivityEntity = itinerary.itineraryActivities.find(itineraryActivity => itineraryActivity.id === itineraryActivityID);

        if (!itineraryActivityFound) {
            throw new BusinessLogicException('The itinerary activity with the given id is not associated to the itinerary', BusinessError.PRECONDITION_FAILED);
        }

        return itineraryActivityFound;
    }

    async findItineraryActivitiesByItineraryID(itineraryID: string): Promise<ItineraryActivityEntity[]> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryID}, relations: ['itineraryActivities']});
        if (!itinerary) {
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);
        }

        return itinerary.itineraryActivities;
    }

    async associateItineraryActivitiesToItinerary(itineraryID: string, itineraryActivities: ItineraryActivityEntity[] ): Promise<ItineraryEntity> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryID}, relations: ['itineraryActivities']});

        if (!itinerary) {
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);
        }

        for (let i = 0; i < itineraryActivities.length; i++) {
            const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivities[i].id}});
            if (!itineraryActivity) {
                throw new BusinessLogicException(`The itinerary activity with the id ${itineraryActivities[i].id} was not found`, BusinessError.NOT_FOUND);
            }
        }

        itinerary.itineraryActivities = itineraryActivities;
        return await this.itineraryRepository.save(itinerary);
    }

    async deleteItineraryActivityFromItinerary(itineraryID: string, itineraryActivityID: string): Promise<ItineraryEntity> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryID}, relations: ['itineraryActivities']});
        if (!itinerary) {
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);
        }

        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivityID}, relations: ['activity', 'itinerary', 'addedBy']});
        if (!itineraryActivity) {
            throw new BusinessLogicException('The itinerary activity with the given id was not found', BusinessError.NOT_FOUND);
        }

        const itineraryActivityFound: ItineraryActivityEntity = itinerary.itineraryActivities.find(itineraryActivity => itineraryActivity.id === itineraryActivityID);

        if (!itineraryActivityFound) {
            throw new BusinessLogicException('The itinerary activity with the given id is not associated to the itinerary', BusinessError.PRECONDITION_FAILED);
        }

        itinerary.itineraryActivities = itinerary.itineraryActivities.filter(e => e.id !== itineraryActivityID);
        return await this.itineraryRepository.save(itinerary);
    }
}
