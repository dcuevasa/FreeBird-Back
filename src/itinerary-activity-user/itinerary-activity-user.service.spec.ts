
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ItineraryActivityUserService } from './itinerary-activity-user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ItineraryActivityUserService', () => {
    let service: ItineraryActivityUserService;
    let userRepository: Repository<UserEntity>;
    let itineraryactivityRepository: Repository<ItineraryActivityEntity>;
    let itineraryactivity: ItineraryActivityEntity;
    let user: UserEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ItineraryActivityUserService],
        }).compile();

        service = module.get<ItineraryActivityUserService>(ItineraryActivityUserService);
        itineraryactivityRepository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

        await seedDatabase();
    });

    const seedDatabase = async () => {
        userRepository.clear();
        itineraryactivityRepository.clear();

        user = await userRepository.save({
            name: faker.string.alphanumeric(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            profilePic: faker.image.url(),
            password: faker.internet.password(),
        
        });

        itineraryactivity = await itineraryactivityRepository.save({
            date: faker.date.recent(),
            time: faker.string.numeric(),
            addedBy: user,
        })
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('associateUserToItineraryActivity should update activities list for a itineraryActivity', async () => {
        
        const newUser: UserEntity = await userRepository.save({
            name: faker.string.alphanumeric(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            profilePic: faker.image.url(),
            password: faker.internet.password(),
        });

        const updatedItineraryActivity: ItineraryActivityEntity = await service.associateUserToItineraryActivity(itineraryactivity.id, newUser.id);

        expect(updatedItineraryActivity.addedBy).toBeDefined();
        expect(updatedItineraryActivity.addedBy.id).toBe(newUser.id);
        expect(updatedItineraryActivity.addedBy.name).toBe(newUser.name);
        expect(updatedItineraryActivity.addedBy.email).toBe(newUser.email);
        expect(updatedItineraryActivity.addedBy.phone).toBe(newUser.phone);
        expect(updatedItineraryActivity.addedBy.profilePic).toBe(newUser.profilePic);
    });

    it('associateUserToItineraryActivity should throw an exception for an invalid itineraryActivity', async () => {
        const newUser: UserEntity = await userRepository.save({
            name: faker.string.alphanumeric(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            profilePic: faker.image.url(),
            password: faker.internet.password(),
        });

        await expect(() => service.associateUserToItineraryActivity("0", newUser.id)).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found");
    });

    it('associateUserToItineraryActivity should throw an exception for an invalid user', async () => {
        await expect(() => service.associateUserToItineraryActivity(itineraryactivity.id, "0")).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    
  it('getUserByItineraryActivityId should return the user of a itineraryActivity', async ()=>{
    const user: UserEntity = await service.getUserByItineraryActivityId(itineraryactivity.id);
    expect(user).toBeDefined();
    expect(user.id).toBe(itineraryactivity.addedBy.id);
  });

  it('getUserByItineraryActivityId should throw an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.getUserByItineraryActivityId("0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteUserFromItineraryActivity should remove an user from a itineraryActivity', async () => {
    
    await service.deleteUserFromItineraryActivity(itineraryactivity.id);

    const storedItineraryActivity: ItineraryActivityEntity = await itineraryactivityRepository.findOne({where: {id: itineraryactivity.id}});
    const deletedUser: UserEntity = storedItineraryActivity.addedBy

    expect(deletedUser).toBeUndefined();

  });

  it('deleteUserFromItineraryActivity should thrown an exception for an invalid itineraryActivity', async () => {
    await expect(()=> service.deleteUserFromItineraryActivity("0")).rejects.toHaveProperty("message", "The itineraryActivity with the given id was not found"); 
  });

  it('deleteUserFromItineraryActivity should thrown an exception for an non asocciated user', async () => {
    const newItineraryActivity: ItineraryActivityEntity = await itineraryactivityRepository.save({
        date: faker.date.recent(),
        time: faker.string.numeric(),
        addedBy: null,
    })

    await expect(()=> service.deleteUserFromItineraryActivity(newItineraryActivity.id)).rejects.toHaveProperty("message", "The itineraryActivity does not have an user associated"); 
  }); 

});