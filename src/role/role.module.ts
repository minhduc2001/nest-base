import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from './entities/role.entity';
import UserPermission from '@/user/entities/user-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserPermission])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
