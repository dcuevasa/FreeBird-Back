
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityEntity } from '../activity/activity.entity';
import { Repository } from 'typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ItineraryActivityActivityService } from './itinerary-activity-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ItineraryActivityActivityService', () => {
    let service: ItineraryActivityActivityService;
    let activityRepository: Repository<ActivityEntity>;
    let itineraryactivityRepository: Repository<ItineraryActivityEntity>;
    let itineraryactivity: ItineraryActivityEntity;
    let activity: ActivityEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ItineraryActivityActivityService],
        }).compile();

        service = module.get<ItineraryActivityActivityService>(ItineraryActivityActivityService);
        itineraryactivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
        activityRepository = module.get<Repository<ActivityEntity>>(getRepositoryToken(ActivityEntity));

        await seedDatabase();
    });

    const seedDatabase = async () => {
        activityRepository.clear();
        itineraryactivityRepository.clear();

        activity = await activityRepository.save({
            durationMins: faker.number.int(),
            name: faker.string.alphanumeric(),
            addressess: [faker.location.streetAddress()],
        });

        itineraryactivity = await itineraryactivityRepository.save({
            date: faker.date.recent(),
            time: faker.string.numeric(),
            activity: activity,
        })
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('associateActivityToItineraryActivity should update activities list for a itineraryActivity', async () => {
        
        const newActivity: ActivityEntity = await activityRepository.save({
            durationMins: faker.number.int(),
            name: faker.string.alphanumeric(),
            addressess: [faker.location.streetAddress()],
        });

        const updatedItineraryActivity: ItineraryActivityEntity = await service.associateActivityToItineraryActivity(itineraryactivity.id, newActivity.id);

        expect(updatedItineraryActivity.activity).toBeDefined();
        expect(updatedItineraryActivity.activity.id).toBe(newActivity.id);
        expect(updatedItineraryActivity.activity.durationMins).toBe(newActivity.durationMins);
        expect(updatedItineraryActivity.activity.name).toBe(newActivity.name);
        expect(updatedItineraryActivity.activity.addressess).toStrictEqual(newActivity.addressess);
    });

    it('associateActivityToItineraryActivity should throw an exception for an invalid itineraryActivity', async () => {
        const newActivity: ActivityEntity = await activityRepository.save({
            durationMins: faker.number.int(),
            name: faker.string.alphanumeric(),
            addressess: [faker.location.streetAddress()]
        });

        await expect(() => service.associateActivityToItineraryActivity("0", newActivity.id)).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
    });

    it('associateActivityToItineraryActivity should throw an exception for an invalid activity', async () => {
        await expect(() => service.associateActivityToItineraryActivity(itineraryactivity.id, "0")).rejects.toHaveProperty("message", "The activity with the given id was not found");
    });

    
  it('getActivityByItineraryActivityId should return the activity of a itineraryActivity', async ()=>{
    const activity: ActivityEntity = await service.getActivityByItineraryActivityId(itineraryactivity.id);
    expect(activity).toBeDefined();
    expect(activity.id).toBe(itineraryactivity.activity.id);
  });

  it('getActivityByItineraryActivityId should throw an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.getActivityByItineraryActivityId("0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteActivityFromItineraryActivity should remove an activity from a itineraryActivity', async () => {
    
    await service.deleteActivityFromItineraryActivity(itineraryactivity.id);

    const storedItineraryActivity: ItineraryActivityEntity = await itineraryactivityRepository.findOne({where: {id: itineraryactivity.id}});
    const deletedActivity: ActivityEntity = storedItineraryActivity.activity

    expect(deletedActivity).toBeUndefined();

  });

  it('deleteActivityFromItineraryActivity should thrown an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.deleteActivityFromItineraryActivity("0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteActivityFromItineraryActivity should thrown an exception for an non asocciated activity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryactivityRepository.save({
        date: faker.date.recent(),
        time: faker.string.numeric(),
        activity: null,
    })

    await expect(()=> service.deleteActivityFromItineraryActivity(newItineraryActivity.id)).rejects.toHaveProperty("message", "The itineraryActivity does not have an activity associated"); 
  }); 

});