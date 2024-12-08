
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UserItineraryService {
   constructor(
       @InjectRepository(ItineraryEntity)
       private readonly itineraryRepository: Repository<ItineraryEntity>,
   
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>
   ) {}

   async addUserItinerary(itineraryId: string, userId: string): Promise<ItineraryEntity> {
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
     
       const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryId}, relations: ["users", "itineraryActivities"]})
       if (!itinerary)
         throw new BusinessLogicException("The itinerary with the given id was not found", BusinessError.NOT_FOUND);
   
       itinerary.users = [...itinerary.users, user];
       return await this.itineraryRepository.save(itinerary);
     }
   
     async findItineraryByUserIdItineraryId(itineraryId: string, userId: string): Promise<ItineraryEntity> {
      const user: UserEntity = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['itineraries'], // Ensure itineraries are loaded
      });
      if (!user) {
        throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);
      }
    
      const itinerary: ItineraryEntity = user.itineraries.find((e) => e.id === itineraryId);
      if (!itinerary) {
        throw new BusinessLogicException(
          'The itinerary with the given id is not associated to the user',
          BusinessError.PRECONDITION_FAILED
        );
      }
    
      return itinerary;
    }
    
   
    async findItinerariesByUserId(userId: string): Promise<ItineraryEntity[]> {
      const user: UserEntity = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['itineraries'],
      });
      if (!user) {
        throw new BusinessLogicException('The user with the given id was not found', BusinessError.NOT_FOUND);
      }
    
      return user.itineraries; // Return user's itineraries
    }
   
   async associateItinerariesUser(userId: string, itineraries: ItineraryEntity[]): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ where: { id: userId }, relations: ["itineraries"] });
  
    if (!user) {
      throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    }
  
    for (let i = 0; i < itineraries.length; i++) {
      const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({ where: { id: itineraries[i].id } });
      if (!itinerary) {
        throw new BusinessLogicException("The itinerary with the given id was not found", BusinessError.NOT_FOUND);
      }
    }
  
    user.itineraries = itineraries;
    return await this.userRepository.save(user);
  }
  
   
   async deleteItineraryUser(userId: string, itineraryId: string){
      const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraries", "itineraryActivities"]});
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
   
       const itinerary: ItineraryEntity = await this.itineraryRepository.findOne({where: {id: itineraryId}, relations: ["users"]});
       if (!itinerary)
         throw new BusinessLogicException("The itinerary with the given id was not found", BusinessError.NOT_FOUND)
   
       const itineraryArtwork: UserEntity = itinerary.users.find(e => e.id === user.id);
   
       if (!itineraryArtwork)
           throw new BusinessLogicException("The user with the given id is not associated to the itinerary", BusinessError.PRECONDITION_FAILED)

       itinerary.users = itinerary.users.filter(e => e.id !== userId);
       await this.itineraryRepository.save(itinerary);
   }  
}