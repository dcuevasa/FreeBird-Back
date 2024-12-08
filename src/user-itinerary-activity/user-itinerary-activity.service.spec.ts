
import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserItineraryActivityService } from './user-itinerary-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserItineraryActivityService', () => {
  let service: UserItineraryActivityService;
  let userRepository: Repository<UserEntity>;
  let itineraryActivityRepository: Repository<ItineraryActivityEntity>;
  let user: UserEntity;
  let itineraryActivitiesList : ItineraryActivityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserItineraryActivityService],
    }).compile();

    service = module.get<UserItineraryActivityService>(UserItineraryActivityService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    itineraryActivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    itineraryActivityRepository.clear();
    userRepository.clear();

    itineraryActivitiesList = [];
    for(let i = 0; i < 5; i++){
        const itineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
          date: faker.date.recent(),
          time: faker.word.sample(),
          itinerary: null,
          activity: null,
          addedBy: null,
        })
        itineraryActivitiesList.push(itineraryActivity);
    }

    user = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.internet.password(),
      itineraryActivities: itineraryActivitiesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserItineraryActivity should add an itineraryActivity to a user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
          date: faker.date.recent(),
          time: faker.word.sample(),
          itinerary: null,
          activity: null,
          addedBy: null,
    });

    const newUser: UserEntity = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.internet.password(),
      itineraryActivities: []
    })

    const result: UserEntity = await service.addUserItineraryActivity(newUser.id, newItineraryActivity.id);
    
    expect(result.itineraryActivities.length).toBe(1);
    expect(result.itineraryActivities[0].id).toBe(newItineraryActivity.id);
    expect(result.itineraryActivities[0].date).toStrictEqual(newItineraryActivity.date);
    expect(result.itineraryActivities[0].time).toBe(newItineraryActivity.time);
    
  });

  it('addUserItineraryActivity should thrown exception for an invalid itineraryActivity', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.internet.password(),
    })

    await expect(() => service.addUserItineraryActivity(newUser.id, "0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
  });

  it('addUserItineraryActivity should throw an exception for an invalid user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    });

    await expect(() => service.addUserItineraryActivity("0", newItineraryActivity.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('findItineraryActivityByUserIdItineraryActivityId should return itineraryActivity by user', async () => {
    const itineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    const storedItineraryActivity: ItineraryActivityEntity = await service.findItineraryActivityByUserIdItineraryActivityId(user.id, itineraryActivity.id, )
    expect(storedItineraryActivity).not.toBeNull();
    expect(storedItineraryActivity.id).toBe(itineraryActivity.id);
    expect(storedItineraryActivity.date).toStrictEqual(itineraryActivity.date);
    expect(storedItineraryActivity.time).toBe(itineraryActivity.time);
  });

  it('findItineraryActivityByUserIdItineraryActivityId should throw an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.findItineraryActivityByUserIdItineraryActivityId(user.id, "0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid user', async () => {
    const itineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0]; 
    await expect(()=> service.findItineraryActivityByUserIdItineraryActivityId("0", itineraryActivity.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findItineraryActivityByUserIdItineraryActivityId should throw an exception for an itineraryActivity not associated to the user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    });

    await expect(()=> service.findItineraryActivityByUserIdItineraryActivityId(user.id, newItineraryActivity.id)).rejects.toHaveProperty("message", "The itineraryActivity with the given id is not associated to the user"); 
  });

  it('findItineraryActivitysByUserId should return itineraryActivities by user', async ()=>{
    const itineraryActivities: ItineraryActivityEntity[] = await service.findItineraryActivitysByUserId(user.id);
    expect(itineraryActivities.length).toBe(5)
  });

  it('findItineraryActivitysByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findItineraryActivitysByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateItineraryActivitysUser should update itineraryActivities list for a user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    });

    const updatedUser: UserEntity = await service.associateItineraryActivitysUser(user.id, [newItineraryActivity]);
    expect(updatedUser.itineraryActivities.length).toBe(1);
    expect(updatedUser.itineraryActivities[0].id).toBe(newItineraryActivity.id);
    expect(updatedUser.itineraryActivities[0].date).toBe(newItineraryActivity.date);
    expect(updatedUser.itineraryActivities[0].time).toBe(newItineraryActivity.time);
  });

  it('associateItineraryActivitysUser should throw an exception for an invalid user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    });

    await expect(()=> service.associateItineraryActivitysUser("0", [newItineraryActivity])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateItineraryActivitysUser should throw an exception for an invalid itineraryActivity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    newItineraryActivity.id = "0";

    await expect(()=> service.associateItineraryActivitysUser(user.id, [newItineraryActivity])).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteUserItineraryActivity should remove an itineraryActivity from a user', async () => {
    const itineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    
    await service.deleteUserItineraryActivity(user.id, itineraryActivity.id);

    const storedMuseum: UserEntity = await userRepository.findOne({where: {id: user.id}, relations: ["itineraryActivities"]});
    const deletedArtwork: ItineraryActivityEntity = storedMuseum.itineraryActivities.find(a => a.id === itineraryActivity.id);

    expect(deletedArtwork).toBeUndefined();

  });

  it('deleteUserItineraryActivity should thrown an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.deleteUserItineraryActivity(user.id, "0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteUserItineraryActivity should thrown an exception for an invalid user', async () => {
    const itineraryActivity: ItineraryActivityEntity = itineraryActivitiesList[0];
    await expect(()=> service.deleteUserItineraryActivity("0", itineraryActivity.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an non asocciated itineraryActivity', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryActivityRepository.save({
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    });

    await expect(()=> service.deleteUserItineraryActivity(user.id, newItineraryActivity.id)).rejects.toHaveProperty("message", "The itineraryActivity with the given id is not associated to the user"); 
  }); 

});