
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
        ) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({relations: ['itineraries', 'itineraryActivities']});
    }

    async findOne(id: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id : id}, relations: ['itineraries', 'itineraryActivities']});
        if (!user)
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);

        return user;
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {email}});
        if (!user)
            throw new BusinessLogicException('The user with the given email was not found', BusinessError.NOT_FOUND);

        return user;
    }

    async findOneByName(name: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {name}});
        if (!user)
            throw new BusinessLogicException('The user with the given name was not found', BusinessError.NOT_FOUND);

        return user;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({where: {id}});
        if (!persistedUser)
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);

        return await this.userRepository.save({...persistedUser, ...user});
    }

    async delete(id: string) {
        const user: UserEntity = await this.userRepository.findOne({where: {id}});
        if (!user)
            throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);

        await this.userRepository.remove(user);
    }
}
