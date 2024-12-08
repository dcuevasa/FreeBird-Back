import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ItineraryUserService } from './itinerary-user.service';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { UserEntity } from '../user/user.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ItineraryUserService', () => {
  let service: ItineraryUserService;
  let itineraryRepository: Repository<ItineraryEntity>;
  let userRepository: Repository<UserEntity>;
  let itinerary: ItineraryEntity;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ItineraryUserService],
    }).compile();

    service = module.get<ItineraryUserService>(ItineraryUserService);
    itineraryRepository = module.get<Repository<ItineraryEntity>>(getRepositoryToken(ItineraryEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await itineraryRepository.clear();
    await userRepository.clear();
    usersList = [];

    for(let i = 0; i < 5; i++) {
      const user = await userRepository.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        profilePic: faker.image.url(),
        itineraries: [],
        password: faker.internet.password()
      });
      usersList.push(user);
    }

    itinerary = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int({min: 1000, max: 10000}),
      destination: faker.location.city(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      preferences: Array.from({length: 3}, () => faker.word.sample()),
      transport: faker.vehicle.type(),
      users: []
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserToItinerary should add user to itinerary', async () => {
    const user = usersList[0];
    const updatedItinerary = await service.addUserToItinerary(itinerary.id, user.id);
    expect(updatedItinerary.users.length).toBe(1);
    expect(updatedItinerary.users[0].id).toBe(user.id);
  });

  it('addUserToItinerary should throw exception for non existent itinerary', async () => {
    await expect(() => 
      service.addUserToItinerary("0", usersList[0].id)
    ).rejects.toHaveProperty("message", "The itinerary with the given id was not found");
  });

  it('addUserToItinerary should throw exception for non existent user', async () => {
    await expect(() => 
      service.addUserToItinerary(itinerary.id, "0")
    ).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('addUserToItinerary should throw exception for already associated user', async () => {
    const user = usersList[0];
    await service.addUserToItinerary(itinerary.id, user.id);
    await expect(() => 
      service.addUserToItinerary(itinerary.id, user.id)
    ).rejects.toHaveProperty("message", "The user is already associated with the itinerary");
  });

  it('findUsersByItineraryId should return users by itinerary', async () => {
    const user = usersList[0];
    await service.addUserToItinerary(itinerary.id, user.id);
    const users = await service.findUsersByItineraryId(itinerary.id);
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user.id);
  });

  it('findUsersByItineraryId should throw exception for non existent itinerary', async () => {
    await expect(() =>
      service.findUsersByItineraryId("0")
    ).rejects.toHaveProperty("message", "The itinerary with the given id was not found");
  });

  it('deleteUserFromItinerary should remove user from itinerary', async () => {
    const user = usersList[0];
    await service.addUserToItinerary(itinerary.id, user.id);
    const updatedItinerary = await service.deleteUserFromItinerary(itinerary.id, user.id);
    expect(updatedItinerary.users.length).toBe(0);
  });

  it('deleteUserFromItinerary should throw exception for non existent itinerary', async () => {
    await expect(() =>
      service.deleteUserFromItinerary("0", usersList[0].id)
    ).rejects.toHaveProperty("message", "The itinerary with the given id was not found");
  });

  it('deleteUserFromItinerary should throw exception for non existent user', async () => {
    await expect(() =>
      service.deleteUserFromItinerary(itinerary.id, "0")
    ).rejects.toHaveProperty("message", "The user with the given id was not found");
  });
});
