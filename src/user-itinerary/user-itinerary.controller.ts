
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserItineraryService } from './user-itinerary.service';
import { ItineraryDto } from 'src/itinerary/itinerary.dto';
import { ItineraryEntity } from 'src/itinerary/itinerary.entity';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserItineraryController {
   constructor(private readonly userItineraryService: UserItineraryService){}


   @Post(':userId/itineraries/:itineraryId')
   async addUserItinerary(@Param('userId') itineraryId: string, @Param('userId') userId: string){
       return await this.userItineraryService.addUserItinerary(itineraryId, userId);
   }

   @Get(':userId/itineraries/:itineraryId')
   async findItineraryByUserIdItineraryId(@Param('userId') userId: string, @Param('itineraryId') itineraryId: string){
       return await this.userItineraryService.findItineraryByUserIdItineraryId(userId, itineraryId);
   }

   @Get(':userId/itineraries')
   async findItineraryByUserId(@Param('userId') userId: string){
       return await this.userItineraryService.findItinerariesByUserId(userId);
   }

   @Put(':userId/itineraries')
   async associateItinerariesUser(@Body() itinerariesDto: ItineraryDto[], @Param('userId') userId: string){
       const itineraries = plainToInstance(ItineraryEntity, itinerariesDto)
       return await this.userItineraryService.associateItinerariesUser(userId,itineraries);
   }

   @Delete(':userId/itineraries/:itineraryId')
   @HttpCode(204)
      async deleteItineraryUser(@Param('userId') userId: string, @Param('itineraryId') itineraryId: string){
          return await this.userItineraryService.deleteItineraryUser(userId, itineraryId);
      }

   
}

