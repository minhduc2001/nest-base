import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@/role/roles.guard';

@Module({
  providers: [
    RoleService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [RoleController],
})
export class RoleModule {}
