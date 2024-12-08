
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for(let i = 0; i < 5; i++){
        const user: UserEntity = await repository.save({
        name: faker.word.sample(),
        email: faker.word.sample(),
        phone: faker.word.sample(),
        profilePic: faker.word.sample(),
        password: faker.internet.password(),
    })
        usersList.push(user);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return an user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name)
    expect(user.email).toEqual(storedUser.email)
    expect(user.phone).toEqual(storedUser.phone)
    expect(user.profilePic).toEqual(storedUser.profilePic)
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: "",
      name: faker.word.sample(),
      email: faker.word.sample(),
      phone: faker.word.sample(),
      profilePic: faker.word.sample(),
      password: faker.internet.password(),
      itineraries: [],
      itineraryActivities: [],
    }

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({ where: { id: newUser.id } })
    expect(storedUser).not.toBeNull();
    expect(user.name).toEqual(storedUser.name)
    expect(user.email).toEqual(storedUser.email)
    expect(user.phone).toEqual(storedUser.phone)
    expect(user.profilePic).toEqual(storedUser.profilePic)

  });
  
  it('update should modify an user', async () => {
    const user: UserEntity = usersList[0];
    user.name = 'New name';
    user.email = 'New email';
    user.phone = 'New phone';
    user.profilePic = 'New profilePic';
    
  
    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();
  
    const storedUser: UserEntity = await repository.findOne({ where: { id: user.id } })
    expect(storedUser).not.toBeNull();
    expect(user.name).toEqual(storedUser.name)
    expect(user.email).toEqual(storedUser.email)
    expect(user.phone).toEqual(storedUser.phone)
    expect(user.profilePic).toEqual(storedUser.profilePic)

  });
 
  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user, name: 'New name', email: 'New email', phone: 'New phone', profilePic: 'New profilePic'
    }
    await expect(() => service.update("0", user)).rejects.toHaveProperty("message", "The user with the given id was not found")
  });

  it('delete should remove an user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
  
    const deletedUser: UserEntity = await repository.findOne({ where: { id: user.id } })
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });
});