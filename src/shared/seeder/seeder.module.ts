import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { SeederService } from '@shared/seeder/seeder.service';
import { UserSeed } from '@shared/seeder/user.seed';
import { Permission } from '@/role/entities/permission.entity';
import { PermissionSeed } from '@shared/seeder/permission.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission])],
  providers: [SeederService, UserSeed, PermissionSeed],
})
export class SeedersModule {}
