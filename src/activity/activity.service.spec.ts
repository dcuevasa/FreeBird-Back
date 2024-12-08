import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActivityEntity } from './activity.entity';
import { ActivityService } from './activity.service';
import { faker } from '@faker-js/faker';

describe('ActivityService', () => {
  let service: ActivityService;
  let repository: Repository<ActivityEntity>;
  let activitiesList: ActivityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActivityService],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    repository = module.get<Repository<ActivityEntity>>(getRepositoryToken(ActivityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    activitiesList = [];
    for(let i = 0; i < 5; i++){
        const activity: ActivityEntity = await repository.save({
            name: faker.word.sample(),
            durationMins: faker.number.int({min: 30, max: 240}),
            addressess: Array.from({length: 2}, () => faker.location.streetAddress())
        });
        activitiesList.push(activity);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all activities', async () => {
    const activities: ActivityEntity[] = await service.findAll();
    expect(activities).not.toBeNull();
    expect(activities).toHaveLength(activitiesList.length);
  });

  it('findOne should return an activity by id', async () => {
    const storedActivity: ActivityEntity = activitiesList[0];
    const activity: ActivityEntity = await service.findOne(storedActivity.id);
    expect(activity).not.toBeNull();
    expect(activity.name).toEqual(storedActivity.name);
    expect(activity.durationMins).toEqual(storedActivity.durationMins);
    expect(activity.addressess).toEqual(storedActivity.addressess);
  });

  it('findOne should throw an exception for an invalid activity', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La actividad con el id dado no fue encontrada");
  });

  it('create should return a new activity', async () => {
    const activity: ActivityEntity = {
      id: "",
      name: faker.word.sample(),
      durationMins: faker.number.int({min: 30, max: 240}),
      addressess: Array.from({length: 2}, () => faker.location.streetAddress()),
      admin: null,
      itineraryActivities: []
    }
    const newActivity: ActivityEntity = await service.create(activity);
    expect(newActivity).not.toBeNull();

    const storedActivity: ActivityEntity = await repository.findOne({where: {id: newActivity.id}})
    expect(storedActivity).not.toBeNull();
    expect(storedActivity.name).toEqual(activity.name);
    expect(storedActivity.durationMins).toEqual(activity.durationMins);
    expect(storedActivity.addressess).toEqual(activity.addressess);
  });

  it('create should throw an exception for an invalid activity', async () => {
    const activity: ActivityEntity = {
      id: "",
      name: "",
      durationMins: 0,
      addressess: [],
      admin: null,
      itineraryActivities: []
    }
    await expect(() => service.create(activity)).rejects.toHaveProperty("message", "La actividad debe tener nombre, duración y dirección");
  });

  it('update should modify an activity', async () => {
    const activity: ActivityEntity = activitiesList[0];
    activity.name = faker.word.sample();
    activity.durationMins = faker.number.int({min: 30, max: 240});
    activity.addressess = Array.from({length: 2}, () => faker.location.streetAddress());
  
    const updatedActivity: ActivityEntity = await service.update(activity.id, activity);
    expect(updatedActivity).not.toBeNull();
  
    const storedActivity: ActivityEntity = await repository.findOne({where: {id: activity.id}})
    expect(storedActivity).not.toBeNull();
    expect(storedActivity.name).toEqual(activity.name);
    expect(storedActivity.durationMins).toEqual(activity.durationMins);
    expect(storedActivity.addressess).toEqual(activity.addressess);
  });

  it('update should throw an exception for an invalid activity', async () => {
    let activity: ActivityEntity = activitiesList[0];
    activity = {
      ...activity, name: "", durationMins: 0, addressess: []
    }
    await expect(() => service.update(activity.id, activity)).rejects.toHaveProperty("message", "La actividad debe tener nombre, duración y dirección");
  });

  it('update should throw an exception for an invalid activity id', async () => {
    const activity: ActivityEntity = activitiesList[0];
    await expect(() => service.update("0", activity)).rejects.toHaveProperty("message", "La actividad con el id dado no fue encontrada");
  });

  it('delete should remove an activity', async () => {
    const activity: ActivityEntity = activitiesList[0];
    await service.delete(activity.id);
    const deletedActivity: ActivityEntity = await repository.findOne({where: {id: activity.id}})
    expect(deletedActivity).toBeNull();
  });

  it('delete should throw an exception for an invalid activity', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La actividad con el id dado no fue encontrada");
  });
});
