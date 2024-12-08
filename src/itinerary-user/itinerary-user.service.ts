import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryUserService {
    constructor(
        @InjectRepository(ItineraryEntity)
        private readonly itineraryRepository: Repository<ItineraryEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async addUserToItinerary(itineraryId: string, userId: string): Promise<ItineraryEntity> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({
            where: { id: itineraryId },
            relations: ['users']
        });

        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['itineraries']
        });

        if (!user)
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);

        if (itinerary.users.find(u => u.id === userId))
            throw new BusinessLogicException('The user is already associated with the itinerary', BusinessError.PRECONDITION_FAILED);

        itinerary.users = [...itinerary.users, user];
        return await this.itineraryRepository.save(itinerary);
    }

    async findUsersByItineraryId(itineraryId: string): Promise<UserEntity[]> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({
            where: { id: itineraryId },
            relations: ['users']
        });

        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        return itinerary.users;
    }

    async deleteUserFromItinerary(itineraryId: string, userId: string): Promise<ItineraryEntity> {
        const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({
            where: { id: itineraryId },
            relations: ['users']
        });

        if (!itinerary)
            throw new BusinessLogicException('The itinerary with the given id was not found', BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user)
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);

        itinerary.users = itinerary.users.filter(u => u.id !== userId);
        return await this.itineraryRepository.save(itinerary);
    }
}
