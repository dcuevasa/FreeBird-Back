
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ItineraryDto } from './itinerary.dto';
import { ItineraryEntity } from './itinerary.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itinerary')
@UseInterceptors(BusinessErrorsInterceptor)
export class ItineraryController {
    constructor(private readonly itineraryService: ItineraryService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return await this.itineraryService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.itineraryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() itineraryDto: ItineraryDto) {
        const itinerary: ItineraryEntity = plainToInstance(ItineraryEntity, itineraryDto);
        return await this.itineraryService.create(itinerary);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() itineraryDto: ItineraryDto) {
        const itinerary: ItineraryEntity = plainToInstance(ItineraryEntity, itineraryDto);
        return await this.itineraryService.update(id, itinerary);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.itineraryService.delete(id);
    }
}
