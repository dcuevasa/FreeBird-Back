import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>
  ) {}

  // Obtener todos los administradores
  async findAll(): Promise<AdminEntity[]> {
    return this.adminRepository.find({ relations: ['activities'] });
  }

  // Obtener un administrador por ID
  async findOne(id: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['activities'],
    });

    if (!admin) {
      throw new BusinessLogicException(
        'The admin with the given ID was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return admin;
  }

  // Crear un nuevo administrador
  async create(admin: AdminEntity): Promise<AdminEntity> {
    return this.adminRepository.save(admin);
  }

  // Actualizar un administrador por ID
  async update(id: string, admin: AdminEntity): Promise<AdminEntity> {
    const existingAdmin = await this.adminRepository.findOne({ where: { id } });

    if (!existingAdmin) {
      throw new BusinessLogicException(
        'The admin with the given ID was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Mezclar los datos existentes con los nuevos y guardar
    const updatedAdmin = { ...existingAdmin, ...admin };
    return this.adminRepository.save(updatedAdmin);
  }

  // Eliminar un administrador por ID
  async delete(id: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new BusinessLogicException(
        'The admin with the given ID was not found',
        BusinessError.NOT_FOUND,
      );
    }

    await this.adminRepository.remove(admin);
  }
}
