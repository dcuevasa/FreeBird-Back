
import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryItineraryActivityService } from './itinerary-itinerary-activity.service';
import { Repository } from 'typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker/.';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ItineraryItineraryActivityService', () => {
  let service: ItineraryItineraryActivityService;
  let itineraryActivityRepository: Repository<ItineraryActivityEntity>;
  let itineraryRepository: Repository<ItineraryEntity>;
  let itineraryActivities: ItineraryActivityEntity[];
  let itinerary: ItineraryEntity;
  let activityRepository: Repository<ActivityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ItineraryItineraryActivityService],
    }).compile();

    service = module.get<ItineraryItineraryActivityService>(ItineraryItineraryActivityService);
    itineraryActivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
    itineraryRepository = module.get<Repository<ItineraryEntity>>(getRepositoryToken(ItineraryEntity));
    activityRepository = module.get<Repository<ActivityEntity>>(getRepositoryToken(ActivityEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    itineraryActivityRepository.clear();
    itineraryRepository.clear();

    itineraryActivities = [];
    for (let i = 0; i < 5; i++) {
      const itineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
        date: faker.date.recent(),
        time: faker.string.numeric(),
      })
      itineraryActivities.push(itineraryActivity);
    }

    itinerary = await itineraryRepository.save({
      name: faker.string.alphanumeric(),
      budget: faker.number.int(),
      destination: faker.string.alpha(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      preferences: [faker.string.alpha(), faker.string.alpha()],
      transport: faker.string.alpha(),
      itineraryActivities: itineraryActivities,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addActivityItineraryToItinerary should add an activity to an itinerary', async () => {
    const newActivity: ActivityEntity = await activityRepository.save({
      durationMins: faker.number.int(),
      name: faker.string.alpha(),
      addressess: [faker.string.alpha(), faker.string.alpha()],
    });

    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      date: faker.date.recent(),
      time: faker.string.numeric(),
      activity: newActivity
    });

    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.string.alphanumeric(),
      budget: faker.number.int(),
      destination: faker.string.alpha(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      preferences: [faker.string.alpha(), faker.string.alpha()],
      transport: faker.string.alpha(),
      itineraryActivities: [],
    });

    const result = await service.addActivityItineraryToItinerary(newItinerary.id, newItineraryActivity.id);

    expect(result.itineraryActivities.length).toBe(1);
    expect(result.itineraryActivities[0]).not.toBeNull();
    expect(result.itineraryActivities[0].id).toBe(newItineraryActivity.id);
    expect(result.itineraryActivities[0].date).toStrictEqual(newItineraryActivity.date);
    expect(result.itineraryActivities[0].time).toBe(newItineraryActivity.time);
  });

  it('addActivityItineraryToItinerary should throw an exception for an invalid itineraryActivity', async () => {
    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.string.alphanumeric(),
      budget: faker.number.int(),
      destination: faker.string.alpha(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      preferences: [faker.string.alpha(), faker.string.alpha()],
      transport: faker.string.alpha(),
      itineraryActivities: itineraryActivities,
    });

    await expect(service.addActivityItineraryToItinerary(newItinerary.id, "0")).rejects.toHaveProperty('message', 'The itinerary activity with the given id was not found');
  });

  it('addActivityItineraryToItinerary should throw an exception for an invalid itinerary', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      date: faker.date.recent(),
      time: faker.string.numeric(),
    });

    await expect(service.addActivityItineraryToItinerary("0", newItineraryActivity.id)).rejects.toHaveProperty('message', 'The itinerary with the given id was not found');
  });

  it('findItineraryActivityByItineraryIDItineraryActivityID should return an itineraryActivity', async () => {
    const result = await service.findItineraryActivityByItineraryIDItineraryActivityID(itinerary.id, itineraryActivities[0].id);

    expect(result).not.toBeNull();
    expect(result.id).toBe(itineraryActivities[0].id);
    expect(result.date).toStrictEqual(itineraryActivities[0].date);
    expect(result.time).toBe(itineraryActivities[0].time);
  });

  it('findItineraryActivityByItineraryIDItineraryActivityID should throw an exception for an invalid itineraryActivity', async () => {
    await expect(service.findItineraryActivityByItineraryIDItineraryActivityID(itinerary.id, "0")).rejects.toHaveProperty('message', 'The itinerary activity with the given id was not found');
  });

  it('findItineraryActivityByItineraryIDItineraryActivityID should throw an exception for an invalid itinerary', async () => {
    await expect(service.findItineraryActivityByItineraryIDItineraryActivityID("0", itineraryActivities[0].id)).rejects.toHaveProperty('message', 'The itinerary with the given id was not found');
  });

  it('findItineraryActivityByItineraryIDItineraryActivityID should throw an exception for an invalid association', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      date: faker.date.recent(),
      time: faker.string.numeric(),
    });

    await expect(() => service.findItineraryActivityByItineraryIDItineraryActivityID(itinerary.id, newItineraryActivity.id)).rejects.toHaveProperty('message', 'The itinerary activity with the given id is not associated to the itinerary');
  });

  it('findItineraryActivitiesByItineraryID should return a list of itineraryActivities', async () => {
    const result = await service.findItineraryActivitiesByItineraryID(itinerary.id);

    expect(result.length).toBe(itineraryActivities.length);
  });

  it('findItineraryActivitiesByItineraryID should throw an exception for an invalid itinerary', async () => {
    await expect(service.findItineraryActivitiesByItineraryID("0")).rejects.toHaveProperty('message', 'The itinerary with the given id was not found');
  });

  it('associateItineraryActivitiesToItinerary should associate a list of itineraryActivities to an itinerary', async () => {
    
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      date: faker.date.recent(),
      time: faker.string.numeric(),
    });

    const result = await service.associateItineraryActivitiesToItinerary(itinerary.id, [newItineraryActivity]);

    expect(result.itineraryActivities.length).toBe(1);
    expect(result.itineraryActivities[0]).not.toBeNull();
    expect(result.itineraryActivities[0].id).toBe(newItineraryActivity.id);
    expect(result.itineraryActivities[0].date).toBe(newItineraryActivity.date);
    expect(result.itineraryActivities[0].time).toBe(newItineraryActivity.time);
  });

  it('associateItineraryActivitiesToItinerary should throw an exception for an invalid itineraryActivity', async () => {

    const newItineraryActivity: ItineraryActivityEntity = itineraryActivities[0];
    newItineraryActivity.id = "0";

    await expect(service.associateItineraryActivitiesToItinerary(itinerary.id, [newItineraryActivity])).rejects.toHaveProperty('message', 'The itinerary activity with the id 0 was not found');
  });

  it('deleteItineraryActivityFromItinerary should delete an itineraryActivity from an itinerary', async () => {
    const itineraryActivity = itineraryActivities[0];
    
    const storedItinerary = await service.deleteItineraryActivityFromItinerary(itinerary.id, itineraryActivity.id);
    const deletedItineraryActivity = storedItinerary.itineraryActivities.find(a => a.id === itineraryActivity.id);

    expect(deletedItineraryActivity).toBeUndefined();
  });

  it('deleteItineraryActivityFromItinerary should throw an exception for an invalid itineraryActivity', async () => {
    await expect(service.deleteItineraryActivityFromItinerary(itinerary.id, "0")).rejects.toHaveProperty('message', 'The itinerary activity with the given id was not found');
  });

  it('deleteItineraryActivityFromItinerary should throw an exception for an invalid itinerary', async () => {
    await expect(service.deleteItineraryActivityFromItinerary("0", itineraryActivities[0].id)).rejects.toHaveProperty('message', 'The itinerary with the given id was not found');
  });
});
