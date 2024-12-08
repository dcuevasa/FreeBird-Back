
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AdminEntity } from '../admin/admin.entity';
import { ActivityEntity } from '../activity/activity.entity';
import { AdminActivityService } from './admin-activity.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AdminActivityService', () => {
  let service: AdminActivityService;
  let adminRepository: Repository<AdminEntity>;
  let activityRepository: Repository<ActivityEntity>;
  let admin: AdminEntity;
  let activitiesList: ActivityEntity[];

  const seedDatabase = async () => {
    activityRepository.clear();
    adminRepository.clear();

    activitiesList = [];
    for (let i = 0; i < 5; i++) {
      const activity = await activityRepository.save({
        durationMins: faker.number.int({ min: 10, max: 300 }),
        name: faker.company.name(),
        addressess: [faker.address.streetAddress(), faker.address.streetAddress()],
      });
      activitiesList.push(activity);
    }

    admin = await adminRepository.save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      profilePic: faker.image.avatar(),
      activities: activitiesList,
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AdminActivityService],
    }).compile();

    service = module.get<AdminActivityService>(AdminActivityService);
    adminRepository = module.get<Repository<AdminEntity>>(getRepositoryToken(AdminEntity));
    activityRepository = module.get<Repository<ActivityEntity>>(getRepositoryToken(ActivityEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addActivityToAdmin should add an activity to an admin', async () => {
    const newActivity = await activityRepository.save({
      durationMins: faker.number.int({ min: 10, max: 300 }),
      name: faker.company.name(),
      addressess: [faker.address.streetAddress()],
    });

    const result = await service.addActivityToAdmin(admin.id, newActivity.id);

    expect(result.activities.length).toBe(activitiesList.length + 1);
    expect(result.activities.find((activity) => activity.id === newActivity.id)).not.toBeNull();
  });

  it('addActivityToAdmin should throw an exception for an invalid admin', async () => {
    const newActivity = await activityRepository.save({
      durationMins: faker.number.int({ min: 10, max: 300 }),
      name: faker.company.name(),
      addressess: [faker.address.streetAddress()],
    });

    await expect(() => service.addActivityToAdmin('0', newActivity.id)).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('addActivityToAdmin should throw an exception for an invalid activity', async () => {
    await expect(() => service.addActivityToAdmin(admin.id, '0')).rejects.toHaveProperty(
      'message',
      'The activity with the given ID was not found',
    );
  });

  it('findActivitiesByAdminId should return activities by admin', async () => {
    const activities = await service.findActivitiesByAdminId(admin.id);

    expect(activities.length).toBe(5);
    expect(activities).toEqual(expect.arrayContaining(activitiesList));
  });

  it('findActivitiesByAdminId should throw an exception for an invalid admin', async () => {
    await expect(() => service.findActivitiesByAdminId('0')).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('associateActivitiesToAdmin should update activities list for an admin', async () => {
    const newActivity = await activityRepository.save({
      durationMins: faker.number.int({ min: 10, max: 300 }),
      name: faker.company.name(),
      addressess: [faker.address.streetAddress()],
    });

    const updatedAdmin = await service.associateActivitiesToAdmin(admin.id, [newActivity]);

    expect(updatedAdmin.activities.length).toBe(1);
    expect(updatedAdmin.activities[0].id).toBe(newActivity.id);
  });

  it('associateActivitiesToAdmin should throw an exception for an invalid admin', async () => {
    const newActivity = await activityRepository.save({
      durationMins: faker.number.int({ min: 10, max: 300 }),
      name: faker.company.name(),
      addressess: [faker.address.streetAddress()],
    });

    await expect(() => service.associateActivitiesToAdmin('0', [newActivity])).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('associateActivitiesToAdmin should throw an exception for an invalid activity', async () => {
    const newActivity = activitiesList[0];
    newActivity.id = '0';

    await expect(() => service.associateActivitiesToAdmin(admin.id, [newActivity])).rejects.toHaveProperty(
        'message',
        'The activity with ID 0 was not found',
      );      
  });

  it('deleteActivityFromAdmin should remove an activity from an admin', async () => {
    const activity = activitiesList[0];
    await service.deleteActivityFromAdmin(admin.id, activity.id);

    const storedAdmin = await adminRepository.findOne({ where: { id: admin.id }, relations: ['activities'] });
    const deletedActivity = storedAdmin.activities.find((a) => a.id === activity.id);

    expect(deletedActivity).toBeUndefined();
  });

  it('deleteActivityFromAdmin should throw an exception for an invalid activity', async () => {
    await expect(() => service.deleteActivityFromAdmin(admin.id, '0')).rejects.toHaveProperty(
        'message',
        'The activity with the given ID is not associated with the admin',
      );
  });

  it('deleteActivityFromAdmin should throw an exception for an invalid admin', async () => {
    const activity = activitiesList[0];
    await expect(() => service.deleteActivityFromAdmin('0', activity.id)).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('deleteActivityFromAdmin should throw an exception for an activity not associated to the admin', async () => {
    const newActivity = await activityRepository.save({
      durationMins: faker.number.int({ min: 10, max: 300 }),
      name: faker.company.name(),
      addressess: [faker.address.streetAddress()],
    });

    await expect(() => service.deleteActivityFromAdmin(admin.id, newActivity.id)).rejects.toHaveProperty(
      'message',
      'The activity with the given ID is not associated with the admin',
    );
  });
});
