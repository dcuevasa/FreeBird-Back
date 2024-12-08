import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ActivityItineraryActivityService } from './activity-itinerary-activity.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ActivityItineraryActivityService', () => {
  let service: ActivityItineraryActivityService;
  let activityRepository: Repository<ActivityEntity>;
  let itineraryActivityRepository: Repository<ItineraryActivityEntity>;
  let activity: ActivityEntity;
  let itineraryActivitiesList: ItineraryActivityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActivityItineraryActivityService],
    }).compile();

    service = module.get<ActivityItineraryActivityService>(ActivityItineraryActivityService);
    activityRepository = module.get<Repository<ActivityEntity>>(getRepositoryToken(ActivityEntity));
    itineraryActivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await activityRepository.clear();
    await itineraryActivityRepository.clear();
    
    itineraryActivitiesList = [];
    
    activity = await activityRepository.save({
      name: faker.word.sample(),
      durationMins: faker.number.int({min: 30, max: 240}),
      addressess: Array.from({length: 2}, () => faker.location.streetAddress()),
      itineraryActivities: []
    });

    for(let i = 0; i < 5; i++){
      const itineraryActivity = await itineraryActivityRepository.save({
        date: faker.date.future(),
        time: faker.date.future().toLocaleTimeString(),
        activity: null,
        itinerary: null,
        addedBy: null
      });
      itineraryActivitiesList.push(itineraryActivity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addItineraryActivityToActivity should add ItineraryActivity to Activity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    const updatedActivity = await service.addItineraryActivityToActivity(activity.id, newItineraryActivity.id);
    
    expect(updatedActivity.itineraryActivities.length).toBe(1);
    expect(updatedActivity.itineraryActivities[0].id).toBe(newItineraryActivity.id);
  });

  it('addItineraryActivityToActivity should throw exception for non existent Activity', async () => {
    await expect(() => 
      service.addItineraryActivityToActivity("0", itineraryActivitiesList[0].id)
    ).rejects.toHaveProperty("message", "The activity with the given id was not found");
  });

  it('addItineraryActivityToActivity should throw exception for non existent ItineraryActivity', async () => {
    await expect(() => 
      service.addItineraryActivityToActivity(activity.id, "0")
    ).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
  });

  it('findItineraryActivitiesByActivityId should return itineraryActivities by activity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    await service.addItineraryActivityToActivity(activity.id, newItineraryActivity.id);
    
    const itineraryActivities = await service.findItineraryActivitiesByActivityId(activity.id);
    expect(itineraryActivities.length).toBe(1);
    expect(itineraryActivities[0].id).toBe(newItineraryActivity.id);
  });

  it('findItineraryActivitiesByActivityId should throw exception for non existent Activity', async () => {
    await expect(() =>
      service.findItineraryActivitiesByActivityId("0")
    ).rejects.toHaveProperty("message", "The activity with the given id was not found");
  });

  it('deleteItineraryActivityFromActivity should remove an ItineraryActivity from Activity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    await service.addItineraryActivityToActivity(activity.id, newItineraryActivity.id);
    
    const updatedActivity = await service.deleteItineraryActivityFromActivity(activity.id, newItineraryActivity.id);
    expect(updatedActivity.itineraryActivities.length).toBe(0);
  });

  it('deleteItineraryActivityFromActivity should throw exception for non existent Activity', async () => {
    await expect(() =>
      service.deleteItineraryActivityFromActivity("0", itineraryActivitiesList[0].id)
    ).rejects.toHaveProperty("message", "The activity with the given id was not found");
  });

  it('deleteItineraryActivityFromActivity should throw exception for non existent ItineraryActivity', async () => {
    await expect(() =>
      service.deleteItineraryActivityFromActivity(activity.id, "0")
    ).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
  });
});
