import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AdminService', () => {
  let service: AdminService;
  let repository: Repository<AdminEntity>;
  let adminList: AdminEntity[];

  const seedDatabase = async () => {
    await repository.clear();
    adminList = [];
    for (let i = 0; i < 5; i++) {
      const admin = await repository.save({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        profilePic: faker.image.avatar(),
      });
      adminList.push(admin);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AdminService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repository = module.get<Repository<AdminEntity>>(getRepositoryToken(AdminEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all admins', async () => {
    const admins = await service.findAll();
    expect(admins).not.toBeNull();
    expect(admins).toHaveLength(adminList.length);
  });

  it('findOne should return an admin by ID', async () => {
    const storedAdmin = adminList[0];
    const admin = await service.findOne(storedAdmin.id);
    expect(admin).not.toBeNull();
    expect(admin.name).toEqual(storedAdmin.name);
    expect(admin.email).toEqual(storedAdmin.email);
    expect(admin.phone).toEqual(storedAdmin.phone);
    expect(admin.profilePic).toEqual(storedAdmin.profilePic);
  });

  it('findOne should throw an exception for an invalid admin', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('create should create a new admin', async () => {
    const admin: AdminEntity = {
      id: '',
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      profilePic: faker.image.avatar(),
      activities: [],
    };

    const newAdmin = await service.create(admin);
    expect(newAdmin).not.toBeNull();

    const storedAdmin = await repository.findOne({ where: { id: newAdmin.id } });
    expect(storedAdmin).not.toBeNull();
    expect(storedAdmin.name).toEqual(newAdmin.name);
    expect(storedAdmin.email).toEqual(newAdmin.email);
    expect(storedAdmin.phone).toEqual(newAdmin.phone);
    expect(storedAdmin.profilePic).toEqual(newAdmin.profilePic);
  });

  it('update should modify an admin', async () => {
    const admin = adminList[0];
    admin.name = 'Updated Name';
    admin.phone = '1234567890';

    const updatedAdmin = await service.update(admin.id, admin);
    expect(updatedAdmin).not.toBeNull();

    const storedAdmin = await repository.findOne({ where: { id: admin.id } });
    expect(storedAdmin).not.toBeNull();
    expect(storedAdmin.name).toEqual(admin.name);
    expect(storedAdmin.phone).toEqual(admin.phone);
  });

  it('update should throw an exception for an invalid admin', async () => {
    const admin: AdminEntity = adminList[0];
    admin.name = 'Invalid Name';

    await expect(() => service.update('0', admin)).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });

  it('delete should remove an admin', async () => {
    const admin = adminList[0];
    await service.delete(admin.id);

    const deletedAdmin = await repository.findOne({ where: { id: admin.id } });
    expect(deletedAdmin).toBeNull();
  });

  it('delete should throw an exception for an invalid admin', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The admin with the given ID was not found',
    );
  });
});
