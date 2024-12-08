import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryActivityItineraryService {
    constructor(
        @InjectRepository(ItineraryEntity)
        private readonly itineraryRepository: Repository<ItineraryEntity>,
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryActivityRepository: Repository<ItineraryActivityEntity>,
    ) {}

    async associateItineraryToItineraryActivity(idItineraryActivity: string, idItinerary: string): Promise<ItineraryActivityEntity> {
        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({
            where: { id: idItineraryActivity }
        });

        if (!itineraryActivity)
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);

        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({
            where: { id: idItinerary }
        });

        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        itineraryActivity.itinerary = itinerary;
        return await this.itineraryActivityRepository.save(itineraryActivity);
    }

    async getItineraryByItineraryActivityId(idItineraryActivity: string): Promise<ItineraryEntity> {
        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({
            where: { id: idItineraryActivity },
            relations: ['itinerary']
        });

        if (!itineraryActivity)
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);

        return itineraryActivity.itinerary;
    }

    async deleteItineraryFromItineraryActivity(idItineraryActivity: string): Promise<ItineraryActivityEntity> {
        const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({
            where: { id: idItineraryActivity },
            relations: ['itinerary']
        });

        if (!itineraryActivity)
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);

        if (!itineraryActivity.itinerary)
            throw new BusinessLogicException('The itineraryActivity does not have an itinerary associated', BusinessError.NOT_FOUND);

        itineraryActivity.itinerary = null;
        return await this.itineraryActivityRepository.save(itineraryActivity);
    }
}
