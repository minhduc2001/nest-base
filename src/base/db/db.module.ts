import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { dbConfig } from './db.config';
import { LoggerService } from '../logger';
import { DatabaseService } from './db.service';

const typeOrmOptions: TypeOrmModuleAsyncOptions[] = [
  {
    inject: [LoggerService],
    useFactory: (loggerService: LoggerService) =>
      ({
        ...dbConfig,
        logging: true,
        logger: loggerService.getDbLogger('database'),
      } as TypeOrmModuleOptions),
  },
];

@Module({
  imports: [
    ...typeOrmOptions.map((options) => TypeOrmModule.forRootAsync(options)),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
