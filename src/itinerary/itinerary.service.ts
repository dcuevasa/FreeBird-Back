
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItineraryEntity } from './itinerary.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryService {
    constructor (
        @InjectRepository(ItineraryEntity)
        private readonly itineraryRepository: Repository<ItineraryEntity>
    ) {}

    async findAll(): Promise<ItineraryEntity[]> {
        return await this.itineraryRepository.find({relations: ['itineraryActivities', 'users']});
    }

    async findOne(id: string): Promise<ItineraryEntity> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id}, relations: ['itineraryActivities', 'users']});
        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        return itinerary;
    }

    async create(itinerary: ItineraryEntity): Promise<ItineraryEntity> {
        if (!itinerary.name || !itinerary.budget || !itinerary.destination || !itinerary.startDate || !itinerary.endDate || !itinerary.preferences || !itinerary.transport)
            throw new BusinessLogicException('The itinerary must have all the required fields', BusinessError.PRECONDITION_FAILED);

        if(itinerary.budget < 0)
            throw new BusinessLogicException('The budget must be greater than 0', BusinessError.PRECONDITION_FAILED);
        
        if(itinerary.startDate > itinerary.endDate)
            throw new BusinessLogicException('The start date must be before the end date', BusinessError.PRECONDITION_FAILED);


        return await this.itineraryRepository.save(itinerary);
    }

    async update(id: string, itinerary: ItineraryEntity): Promise<ItineraryEntity> {
        const persistedItinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id}});
        if (!persistedItinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        if (!itinerary.name || !itinerary.budget || !itinerary.destination || !itinerary.startDate || !itinerary.endDate || !itinerary.preferences || !itinerary.transport)
            throw new BusinessLogicException('The itinerary must have all the required fields', BusinessError.PRECONDITION_FAILED);

        if(itinerary.budget < 0)
            throw new BusinessLogicException('The budget must be greater than 0', BusinessError.PRECONDITION_FAILED);
        
        if(itinerary.startDate >= itinerary.endDate)
            throw new BusinessLogicException('The start date must be before the end date', BusinessError.PRECONDITION_FAILED);

        return await this.itineraryRepository.save({...persistedItinerary, ...itinerary});
    }

    async delete(id: string) {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id}});
        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        await this.itineraryRepository.remove(itinerary);
    }
}
