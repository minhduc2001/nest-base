import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import * as log4js from 'log4js';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        log4js.configure({
          appenders: {
            console: { type: 'console' },
            file: {
              type: 'file',
              filename: 'logs/combined.log',
              maxLogSize: 1024 * 1024 * 10, // 10 MB
              backups: 3,
            },
          },
          categories: {
            default: { appenders: ['console', 'file'], level: 'debug' },
          },
        });
        const logger = log4js.getLogger();
        return new LoggerService(logger);
      },
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
