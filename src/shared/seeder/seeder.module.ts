import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from '@shared/seeder/seeder.service';
import { UserSeed } from '@shared/seeder/user.seed';
import { PermissionSeed } from '@shared/seeder/permission.seed';
import Permission from '@/permission/entities/permission.entity';
import User from '@/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission])],
  providers: [SeederService, UserSeed, PermissionSeed],
})
export class SeedersModule {}
