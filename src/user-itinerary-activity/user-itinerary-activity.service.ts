
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UserItineraryActivityService {
   constructor(
       @InjectRepository(UserEntity)
       private readonly userRepository: Repository<UserEntity>,
   
       @InjectRepository(ItineraryActivityEntity)
       private readonly itineraryActivityRepository: Repository<ItineraryActivityEntity>
   ) {}

   async addUserItineraryActivity(userId: string, itineraryActivityId: string): Promise<UserEntity> {
       const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivityId}});
       if (!itineraryActivity)
         throw new BusinessLogicException("The itineraryActivity with the given id was not found", BusinessError.NOT_FOUND);
     
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraryActivities", "itineraries"]})
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
   
       user.itineraryActivities = [...user.itineraryActivities, itineraryActivity];
       return await this.userRepository.save(user);
     }
   
   async findItineraryActivityByUserIdItineraryActivityId(userId: string, itineraryActivityId: string): Promise<ItineraryActivityEntity> {
       const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivityId}});
       if (!itineraryActivity)
         throw new BusinessLogicException("The itineraryActivity with the given id was not found", BusinessError.NOT_FOUND)
      
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraryActivities"]});
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
  
       const userItineraryActivity: ItineraryActivityEntity = user.itineraryActivities.find(e => e.id === itineraryActivity.id);
  
       if (!userItineraryActivity)
         throw new BusinessLogicException("The itineraryActivity with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
  
       return userItineraryActivity;
   }
   
   async findItineraryActivitysByUserId(userId: string): Promise<ItineraryActivityEntity[]> {
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraryActivities"]});
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
      
       return user.itineraryActivities;
   }
   
   async associateItineraryActivitysUser(userId: string, itineraryActivities: ItineraryActivityEntity[]): Promise<UserEntity> {
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraryActivities"]});
   
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < itineraryActivities.length; i++) {
         const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivities[i].id}});
         if (!itineraryActivity)
           throw new BusinessLogicException("The itineraryActivity with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       user.itineraryActivities = itineraryActivities;
       return await this.userRepository.save(user);
     }
   
   async deleteUserItineraryActivity(userId: string, itineraryActivityId: string){
       const itineraryActivity: ItineraryActivityEntity = await this.itineraryActivityRepository.findOne({where: {id: itineraryActivityId}});
       if (!itineraryActivity)
         throw new BusinessLogicException("The itineraryActivity with the given id was not found", BusinessError.NOT_FOUND)
   
       const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["itineraryActivities"]});
       if (!user)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
   
       const userItineraryActivity: ItineraryActivityEntity = user.itineraryActivities.find(e => e.id === itineraryActivity.id);
   
       if (!userItineraryActivity)
           throw new BusinessLogicException("The itineraryActivity with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)

       user.itineraryActivities = user.itineraryActivities.filter(e => e.id !== itineraryActivityId);
       await this.userRepository.save(user);
   }  
}