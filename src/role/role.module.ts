import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@/role/roles.guard';
import { PermissionGuard } from '@/role/permission.guard';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  providers: [
    RoleService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  controllers: [RoleController],
})
export class RoleModule {}
