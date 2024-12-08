import { SetMetadata } from '@nestjs/common';

// Role management (optional)
export const RolesList = {
  USER: 'user',
  ADMIN: 'admin',
};

// Decorator to assign roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
