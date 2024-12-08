
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ItineraryActivityUserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ItineraryActivityEntity)
        private readonly itineraryactivityRepository: Repository<ItineraryActivityEntity>,
    ) {}

    async associateUserToItineraryActivity(idItineraryActivity: string, idActivity: string): Promise<ItineraryActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity}
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        const user: UserEntity = await this.userRepository.findOne({
            where: {id: idActivity}
        });

        if (!user) {
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);
        }

        if (itineraryactivity.addedBy) {
            throw new BusinessLogicException('The itineraryActivity already has an user associated', BusinessError.ALREADY_EXISTS);
        }

        itineraryactivity.addedBy = user;
        return await this.itineraryactivityRepository.save(itineraryactivity);
    }

    async getUserByItineraryActivityId(idItineraryActivity: string): Promise<UserEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity},
            relations: ['addedBy'],
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        return itineraryactivity.addedBy;
    }

    async deleteUserFromItineraryActivity(idItineraryActivity: string): Promise<ItineraryActivityEntity> {
        const itineraryactivity: ItineraryActivityEntity = await this.itineraryactivityRepository.findOne({
            where: {id: idItineraryActivity},
            relations: ['addedBy'],
        });

        if (!itineraryactivity) {
            throw new BusinessLogicException('The itineraryActivity with the given id was not found', BusinessError.NOT_FOUND);
        }

        if (!itineraryactivity.addedBy) {
            throw new BusinessLogicException('The itineraryActivity does not have an user associated', BusinessError.NOT_FOUND);
        }

        itineraryactivity.addedBy = null;
        return await this.itineraryactivityRepository.save(itineraryactivity);
    }
}
