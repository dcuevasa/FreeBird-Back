
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ItineraryActivityEntity } from './itinerary-activity.entity';
import { ItineraryActivityService } from './itinerary-activity.service';
import { faker } from '@faker-js/faker';

describe('ItineraryActivityService', () => {
  let service: ItineraryActivityService;
  let repository: Repository<ItineraryActivityEntity>;
  let itineraryactivitysList: ItineraryActivityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ItineraryActivityService],
    }).compile();

    service = module.get<ItineraryActivityService>(ItineraryActivityService);
    repository = module.get<Repository<ItineraryActivityEntity>>(getRepositoryToken(ItineraryActivityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    itineraryactivitysList = [];
    for(let i = 0; i < 5; i++){
        const itineraryactivity: ItineraryActivityEntity = await repository.save({
        date: faker.date.recent(),
        time: faker.word.sample(),
        })
        itineraryactivitysList.push(itineraryactivity);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all itineraryactivitys', async () => {
    const itineraryactivitys: ItineraryActivityEntity[] = await service.findAll();
    expect(itineraryactivitys).not.toBeNull();
    expect(itineraryactivitys).toHaveLength(itineraryactivitysList.length);
  });

  it('findOne should return an itineraryactivity by id', async () => {
    const storedItineraryActivity: ItineraryActivityEntity = itineraryactivitysList[0];
    const itineraryactivity: ItineraryActivityEntity = await service.findOne(storedItineraryActivity.id);
    expect(itineraryactivity).not.toBeNull();
    expect(itineraryactivity.date).toEqual(storedItineraryActivity.date)
    expect(itineraryactivity.time).toEqual(storedItineraryActivity.time)
  });

  it('findOne should throw an exception for an invalid itineraryactivity', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The itineraryactivity with the given id was not found")
  });

  it('create should return a new itineraryactivity', async () => {
    const itineraryactivity: ItineraryActivityEntity = {
      id: "",
      date: faker.date.recent(),
      time: faker.word.sample(),
      itinerary: null,
      activity: null,
      addedBy: null,
    }

    const newItineraryActivity: ItineraryActivityEntity = await service.create(itineraryactivity);
    expect(newItineraryActivity).not.toBeNull();

    const storedItineraryActivity: ItineraryActivityEntity = await repository.findOne({where: {id: newItineraryActivity.id}})
    expect(storedItineraryActivity).not.toBeNull();
    expect(itineraryactivity.date).toEqual(storedItineraryActivity.date)
    expect(itineraryactivity.time).toEqual(storedItineraryActivity.time)
  });

  it('update should modify an itineraryactivity', async () => {
    const itineraryactivity: ItineraryActivityEntity = itineraryactivitysList[0];
    itineraryactivity.date = new Date();
    itineraryactivity.time = 'New time';
  
    const updatedItineraryActivity: ItineraryActivityEntity = await service.update(itineraryactivity.id, itineraryactivity);
    expect(updatedItineraryActivity).not.toBeNull();
  
    const storedItineraryActivity: ItineraryActivityEntity = await repository.findOne({ where: { id: itineraryactivity.id } })
    expect(storedItineraryActivity).not.toBeNull();
    expect(itineraryactivity.date).toEqual(storedItineraryActivity.date)
    expect(itineraryactivity.time).toEqual(storedItineraryActivity.time)
  });
 
  it('update should throw an exception for an invalid itineraryactivity', async () => {
    let itineraryactivity: ItineraryActivityEntity = itineraryactivitysList[0];
    itineraryactivity = {
      ...itineraryactivity, date: new Date(), time: 'New time'
    }
    await expect(() => service.update("0", itineraryactivity)).rejects.toHaveProperty("message", "The itineraryactivity with the given id was not found")
  });

  it('delete should remove an itineraryactivity', async () => {
    const itineraryactivity: ItineraryActivityEntity = itineraryactivitysList[0];
    await service.delete(itineraryactivity.id);
  
    const deletedItineraryActivity: ItineraryActivityEntity = await repository.findOne({ where: { id: itineraryactivity.id } })
    expect(deletedItineraryActivity).toBeNull();
  });

  it('delete should throw an exception for an invalid itineraryactivity', async () => {
    const itineraryactivity: ItineraryActivityEntity = itineraryactivitysList[0];
    await service.delete(itineraryactivity.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The itineraryactivity with the given id was not found")
  });
 
});