
import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserItineraryService } from './user-itinerary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserItineraryService', () => {
  let service: UserItineraryService;
  let userRepository: Repository<UserEntity>;
  let itineraryRepository: Repository<ItineraryEntity>;
  let user: UserEntity;
  let itineraryList : ItineraryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserItineraryService],
    }).compile();

    service = module.get<UserItineraryService>(UserItineraryService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    itineraryRepository = module.get<Repository<ItineraryEntity>>(getRepositoryToken(ItineraryEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    itineraryRepository.clear();
    userRepository.clear();
  
    itineraryList = [];
    for (let i = 0; i < 5; i++) {
      const itinerary: ItineraryEntity = await itineraryRepository.save({
        name: faker.word.sample(),
        budget: faker.number.int(),
        destination: faker.word.sample(),
        startDate: faker.date.recent(),
        endDate: faker.date.recent(),
        transport: faker.word.sample(),
        preferences: Array.from({ length: 3 }, () => faker.word.sample()),
      });
      console.log('Itinerary created:', itinerary); // Verifica si se guarda correctamente
      itineraryList.push(itinerary);
    }
  
    user = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.word.sample(),
      itineraries: itineraryList,
    });
    console.log('User created:', user); // Verifica si se guarda correctamente
  };
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserItinerary should add an itinerary to a user', async () => {
    const newItineray: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample())
    });

    const newUser: UserEntity = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.word.sample(),
    })

    const result: ItineraryEntity = await service.addUserItinerary(newItineray.id, newUser.id);
    
    expect(result.users.length).toBe(1);
    expect(result.users[0]).not.toBeNull();
    expect(result.users[0].name).toBe(newUser.name)
    expect(result.users[0].email).toBe(newUser.email)
    expect(result.users[0].phone).toBe(newUser.phone)
    expect(result.users[0].profilePic).toBe(newUser.profilePic)

   });

  it('addUserItinerary should thrown exception for an invalid user', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.word.sample(),
    })

    await expect(() => service.addUserItinerary(newUser.id, "0")).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('addUserItinerary should throw an exception for an invalid itinerary', async () => {
    const newItineray: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample())
    });

    await expect(() => service.addUserItinerary("0", newItineray.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

    it('findItineraryByUserIdItineraryId should return itinerary by user', async () => {
    const itinerary: ItineraryEntity = itineraryList[0];
    const storedItinerary: ItineraryEntity = await service.findItineraryByUserIdItineraryId(itinerary.id, user.id);
    expect(storedItinerary).not.toBeNull();
    expect(storedItinerary.name).toBe(itinerary.name);
    expect(storedItinerary.budget).toBe(itinerary.budget);
    expect(storedItinerary.destination).toBe(itinerary.destination);
    expect(storedItinerary.startDate).toStrictEqual(itinerary.startDate);
    expect(storedItinerary.endDate).toStrictEqual(itinerary.endDate);
    expect(storedItinerary.transport).toBe(itinerary.transport);
    expect(storedItinerary.preferences).toEqual(itinerary.preferences);
  });

  it('findItinerariesByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findItinerariesByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findItineraryByUserIdItineraryId should throw an exception for an invalid user', async () => {
    const itinerary: ItineraryEntity = itineraryList[0]; 
    await expect(()=> service.findItineraryByUserIdItineraryId("0", itinerary.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

   it('findItineraryByUserIdItineraryId should throw an exception for an itinerary not associated to the user', async () => {
    // Create and save a new user
    const newUser: UserEntity = await userRepository.save({
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.word.sample(),
    });
  
    // Create and save a new itinerary
    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample())
    });
  
    // Expect the service to throw an exception because the itinerary is not associated with the user
    await expect(() => service.findItineraryByUserIdItineraryId(newItinerary.id, newUser.id)).rejects.toHaveProperty("message", "The itinerary with the given id is not associated to the user");
  });

  it('findItinerarysByUserId should return itinerarys by user', async ()=>{
    const itinerarys: ItineraryEntity[] = await service.findItinerariesByUserId(user.id);
    expect(itinerarys.length).toBe(5)
  });

  it('findItinerarysByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findItinerariesByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateItinerarysUser should update itinerarys list for a user', async () => {
    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample()) 
    });

    const updatedUser: UserEntity = await service.associateItinerariesUser(user.id, [newItinerary]);
    expect(updatedUser.itineraries.length).toBe(1);

    expect(updatedUser.itineraries[0].name).toBe(newItinerary.name);
    expect(updatedUser.itineraries[0].budget).toBe(newItinerary.budget);
    expect(updatedUser.itineraries[0].destination).toBe(newItinerary.destination);
    expect(updatedUser.itineraries[0].startDate).toBe(newItinerary.startDate);
    expect(updatedUser.itineraries[0].endDate).toBe(newItinerary.endDate);
    expect(updatedUser.itineraries[0].transport).toBe(newItinerary.transport);
    expect(updatedUser.itineraries[0].preferences).toEqual(newItinerary.preferences);

  });

  it('associateItinerarysUser should throw an exception for an invalid user', async () => {
    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample())
    });

    await expect(()=> service.associateItinerariesUser("0", [newItinerary])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateItinerariesUser should throw an exception for an invalid itinerary', async () => {
    const newItinerary: ItineraryEntity = itineraryList[0];
    newItinerary.id = "0";

    await expect(()=> service.associateItinerariesUser(user.id, [newItinerary])).rejects.toHaveProperty("message", "The itinerary with the given id was not found"); 
  });

  it('deleteItineraryToUser should remove an itinerary from a user', async () => {
    const itinerary: ItineraryEntity = itineraryList[0];
    
    await service.deleteItineraryUser(user.id, itinerary.id);

    const storedUser: UserEntity = await userRepository.findOne({where: {id: user.id}, relations: ["itineraries", "itineraryActivities"]});
    const deletedItinerary: ItineraryEntity = storedUser.itineraries.find(a => a.id === itinerary.id);

    expect(deletedItinerary).toBeUndefined();

  });

  it('deleteItineraryToUser should thrown an exception for an invalid itinerary', async () => {
    await expect(()=> service.deleteItineraryUser(user.id, "0")).rejects.toHaveProperty("message", "The itinerary with the given id was not found"); 
  });

  it('deleteItineraryToUser should thrown an exception for an invalid user', async () => {
    const itinerary: ItineraryEntity = itineraryList[0];
    await expect(()=> service.deleteItineraryUser("0", itinerary.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteItineraryToUser should thrown an exception for an non asocciated itinerary', async () => {
    const newItinerary: ItineraryEntity = await itineraryRepository.save({
      name: faker.word.sample(),
      budget: faker.number.int(),
      destination: faker.word.sample(),
      startDate: faker.date.recent(),
      endDate: faker.date.recent(),
      transport: faker.word.sample(),
      preferences: Array.from({ length: 3 }, () => faker.word.sample())
    });

    await expect(()=> service.deleteItineraryUser(user.id, newItinerary.id)).rejects.toHaveProperty("message", "The user with the given id is not associated to the itinerary"); 
  }); 

});