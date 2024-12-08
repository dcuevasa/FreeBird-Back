
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ItineraryEntity } from './itinerary.entity';
import { ItineraryService } from './itinerary.service';
import { faker } from '@faker-js/faker';

describe('ItineraryService', () => {
  let service: ItineraryService;
  let repository: Repository<ItineraryEntity>;
  let itinerarysList: ItineraryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ItineraryService],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
    repository = module.get<Repository<ItineraryEntity>>(getRepositoryToken(ItineraryEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    itinerarysList = [];
    for(let i = 0; i < 5; i++){
        const itinerary: ItineraryEntity = await repository.save({
        name: faker.word.sample(),
        budget: faker.number.int(),
        destination: faker.word.sample(),
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
        transport: faker.word.sample(),
        preferences: Array.from({ length: 3 }, () => faker.word.sample())
        })
        itinerarysList.push(itinerary);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all itineraries', async () => {
    const itinerarys: ItineraryEntity[] = await service.findAll();
    expect(itinerarys).not.toBeNull();
    expect(itinerarys).toHaveLength(itinerarysList.length);
  });

  it('findOne should return an itinerary by id', async () => {
    const storedItinerary: ItineraryEntity = itinerarysList[0];
    const itinerary: ItineraryEntity = await service.findOne(storedItinerary.id);
    expect(itinerary).not.toBeNull();
    expect(itinerary.name).toEqual(storedItinerary.name)
    expect(itinerary.budget).toEqual(storedItinerary.budget)
    expect(itinerary.destination).toEqual(storedItinerary.destination)
    expect(itinerary.startDate).toEqual(storedItinerary.startDate)
    expect(itinerary.endDate).toEqual(storedItinerary.endDate)
    expect(itinerary.preferences).toEqual(storedItinerary.preferences)
    expect(itinerary.transport).toEqual(storedItinerary.transport)
  });

  it('findOne should throw an exception for an invalid itinerary', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The itinerary with the given id was not found")
  });

  it('create should return a new itinerary', async () => {
    const itinerary: ItineraryEntity = {
      id: "",
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample()),
      users: [],
      itineraryActivities: [],
    }

    const newItinerary: ItineraryEntity = await service.create(itinerary);
    expect(newItinerary).not.toBeNull();

    const storedItinerary: ItineraryEntity = await repository.findOne({ where: { id: newItinerary.id } })
    expect(storedItinerary).not.toBeNull();
    expect(itinerary.name).toEqual(storedItinerary.name)
    expect(itinerary.budget).toEqual(storedItinerary.budget)
    expect(itinerary.destination).toEqual(storedItinerary.destination)
    expect(itinerary.startDate).toEqual(storedItinerary.startDate)
    expect(itinerary.endDate).toEqual(storedItinerary.endDate)
    expect(itinerary.preferences).toEqual(storedItinerary.preferences)
    expect(itinerary.transport).toEqual(storedItinerary.transport)
  });

  it('create should throw an exception for an itinerary with negative budget', async () => {
    const itinerary: ItineraryEntity = {
      id: "",
      name: faker.word.sample(),
      budget: -1,
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample()),
      users: [],
      itineraryActivities: [],
    }

    await expect(() => service.create(itinerary)).rejects.toHaveProperty("message", "The budget must be greater than 0")
  });

  it('create should throw an exception for an itinerary with invalid dates', async () => {
    const itinerary: ItineraryEntity = {
      id: "",
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: new Date("2021-01-10"),
      endDate: new Date("2020-01-01"),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample()),
      users: [],
      itineraryActivities: [],
    }

    await expect(() => service.create(itinerary)).rejects.toHaveProperty("message", "The start date must be before the end date")
  });

  
  it('update should modify an itinerary', async () => {
    const itinerary: ItineraryEntity = itinerarysList[0];
  
    const updatedItinerary: ItineraryEntity = await service.update(itinerary.id, itinerary);
    expect(updatedItinerary).not.toBeNull();
  
    const storedItinerary: ItineraryEntity = await repository.findOne({ where: { id: itinerary.id } })
    expect(storedItinerary).not.toBeNull();
    expect(itinerary.name).toEqual(storedItinerary.name)
    expect(itinerary.budget).toEqual(storedItinerary.budget)
    expect(itinerary.destination).toEqual(storedItinerary.destination)
    expect(itinerary.startDate).toEqual(storedItinerary.startDate)
    expect(itinerary.endDate).toEqual(storedItinerary.endDate)
    expect(itinerary.preferences).toEqual(storedItinerary.preferences)
    expect(itinerary.transport).toEqual(storedItinerary.transport)
  });
 
  it('update should throw an exception for an invalid itinerary', async () => {
    let itinerary: ItineraryEntity = itinerarysList[0];
    itinerary = {
      ...itinerary, name: 'New name', budget: 0, destination: 'New destination', startDate: new Date(), endDate: new Date(), transport: 'New transport'
    }
    await expect(() => service.update("0", itinerary)).rejects.toHaveProperty("message", "The itinerary with the given id was not found")
  });

  it('update should throw an exception for an itinerary with negative budget', async () => {
    let itinerary: ItineraryEntity = itinerarysList[0];
    itinerary = {
      ...itinerary, budget: -1
    }
    await expect(() => service.update(itinerary.id, itinerary)).rejects.toHaveProperty("message", "The budget must be greater than 0")
  });

  it('update should throw an exception for an itinerary with invalid dates', async () => {
    let itinerary: ItineraryEntity = itinerarysList[0];
    itinerary = {
      ...itinerary, startDate: new Date("2021-01-10"), endDate: new Date("2020-01-01")
    }
    await expect(() => service.update(itinerary.id, itinerary)).rejects.toHaveProperty("message", "The start date must be before the end date")
  });

  it('delete should remove an itinerary', async () => {
    const itinerary: ItineraryEntity = itinerarysList[0];
    await service.delete(itinerary.id);
  
    const deletedItinerary: ItineraryEntity = await repository.findOne({ where: { id: itinerary.id } })
    expect(deletedItinerary).toBeNull();
  });

  it('delete should throw an exception for an invalid itinerary', async () => {
    const itinerary: ItineraryEntity = itinerarysList[0];
    await service.delete(itinerary.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The itinerary with the given id was not found")
  });
});