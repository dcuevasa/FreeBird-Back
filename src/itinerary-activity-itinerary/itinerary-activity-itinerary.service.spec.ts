import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ItineraryActivityItineraryService } from './itinerary-activity-itinerary.service';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ItineraryActivityItineraryService', () => {
    let service: ItineraryActivityItineraryService;
    let itineraryActivityRepository: Repository<ItineraryActivityEntity>;
    let itineraryRepository: Repository<ItineraryEntity>;
    let itineraryActivity: ItineraryActivityEntity;
    let itineraryList: ItineraryEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ItineraryActivityItineraryService],
        }).compile();

        service = module.get<ItineraryActivityItineraryService>(ItineraryActivityItineraryService);
        itineraryActivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
        itineraryRepository = module.get<Repository<ItineraryEntity>>(getRepositoryToken(ItineraryEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        await itineraryActivityRepository.clear();
        await itineraryRepository.clear();
        itineraryList = [];

        for (let i = 0; i < 5; i++) {
            const itinerary = await itineraryRepository.save({
                name: faker.word.sample(),
                budget: faker.number.int({min: 1000, max: 10000}),
                destination: faker.location.city(),
                startDate: faker.date.future(),
                endDate: faker.date.future(),
                preferences: Array.from({length: 3}, () => faker.word.sample()),
                transport: faker.vehicle.type(),
                users: [],
                itineraryActivities: []
            });
            itineraryList.push(itinerary);
        }

        itineraryActivity = await itineraryActivityRepository.save({
            date: faker.date.future(),
            time: faker.date.future().toLocaleTimeString(),
            itinerary: null,
            activity: null,
            addedBy: null
        });
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('associateItineraryToItineraryActivity should associate an itinerary to an itineraryActivity', async () => {
        const itinerary = itineraryList[0];
        const updatedItineraryActivity = await service.associateItineraryToItineraryActivity(itineraryActivity.id, itinerary.id);
        expect(updatedItineraryActivity).not.toBeNull();
        expect(updatedItineraryActivity.itinerary.id).toBe(itinerary.id);
    });

    it('associateItineraryToItineraryActivity should throw an exception for invalid itineraryActivity', async () => {
        const itinerary = itineraryList[0];
        await expect(() => 
            service.associateItineraryToItineraryActivity("0", itinerary.id)
        ).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
    });

    it('associateItineraryToItineraryActivity should throw an exception for invalid itinerary', async () => {
        await expect(() => 
            service.associateItineraryToItineraryActivity(itineraryActivity.id, "0")
        ).rejects.toHaveProperty("message", "The itinerary with the given id was not found");
    });

    it('getItineraryByItineraryActivityId should return itinerary by itineraryActivity', async () => {
        const itinerary = itineraryList[0];
        await service.associateItineraryToItineraryActivity(itineraryActivity.id, itinerary.id);
        
        const storedItinerary = await service.getItineraryByItineraryActivityId(itineraryActivity.id);
        expect(storedItinerary).not.toBeNull();
        expect(storedItinerary.id).toBe(itinerary.id);
    });

    it('getItineraryByItineraryActivityId should throw an exception for invalid itineraryActivity', async () => {
        await expect(() =>
            service.getItineraryByItineraryActivityId("0")
        ).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
    });

    it('deleteItineraryFromItineraryActivity should remove itinerary from itineraryActivity', async () => {
        const itinerary = itineraryList[0];
        await service.associateItineraryToItineraryActivity(itineraryActivity.id, itinerary.id);
        
        const updatedItineraryActivity = await service.deleteItineraryFromItineraryActivity(itineraryActivity.id);
        expect(updatedItineraryActivity.itinerary).toBeNull();
    });

    it('deleteItineraryFromItineraryActivity should throw an exception for invalid itineraryActivity', async () => {
        await expect(() =>
            service.deleteItineraryFromItineraryActivity("0")
        ).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
    });

    it('deleteItineraryFromItineraryActivity should throw an exception when itineraryActivity has no itinerary', async () => {
        await expect(() =>
            service.deleteItineraryFromItineraryActivity(itineraryActivity.id)
        ).rejects.toHaveProperty("message", "The itineraryActivity does not have an itinerary associated");
    });
});
