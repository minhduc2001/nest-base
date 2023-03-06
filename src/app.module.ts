import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// BASE
import { config } from '@base/config';
import { LoggerModule } from '@base/logger/logger.module';
import { dbConfig } from '@base/db/db.config';

// APPS
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { SeedersModule } from '@shared/seeder/seeder.module';

// SHARED

const appModule = [AuthModule, UserModule, RoleModule];
const baseModule = [LoggerModule];

@Module({
  imports: [
    ...baseModule,
    ...appModule,
    TypeOrmModule.forRoot(dbConfig),
    SeedersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
