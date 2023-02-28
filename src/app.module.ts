import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '@base/config';

import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@base/logger/logger.module';
import { dbConfig } from '@base/db/db.config';

const appModule = [AuthModule];
const baseModule = [LoggerModule];

@Module({
  imports: [...baseModule, ...appModule, TypeOrmModule.forRoot(dbConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
