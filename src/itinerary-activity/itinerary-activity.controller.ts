
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItineraryActivityService } from './itinerary-activity.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ItineraryActivityDto } from './itinerary-activity.dto';
import { ItineraryActivityEntity } from './itinerary-activity.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('itinerary-activity')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryActivityController {
    constructor(private readonly itineraryActivityService: ItineraryActivityService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return await this.itineraryActivityService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.itineraryActivityService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() itineraryActivityDto: ItineraryActivityDto) {
        const itineraryActivity: ItineraryActivityEntity = plainToInstance(ItineraryActivityEntity, itineraryActivityDto);
        return await this.itineraryActivityService.create(itineraryActivity);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() itineraryActivityDto: ItineraryActivityDto) {
        const itineraryActivity: ItineraryActivityEntity = plainToInstance(ItineraryActivityEntity, itineraryActivityDto);
        return await this.itineraryActivityService.update(id, itineraryActivity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.itineraryActivityService.delete(id);
    }
}


