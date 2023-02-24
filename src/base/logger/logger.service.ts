import { Injectable } from '@nestjs/common';
import { Appender, configure, Logger } from 'log4js';

const appenders: Record<string, Appender> = {
  console: {
    type: 'console',
  },
  file: {
    type: 'file',
    filename: 'logs/combind.log',
    pattern: '-yyyy-MM-dd',
    maxLogSize: 1024 * 1024 * 10, // 10 MB
    backups: 3,
  },
  access: {
    type: 'console',
  },
};

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor() {
    const level = config.DEBUG ? 'debug' : 'info';

    configure({
      appenders: appenders,
      categories: {
        default: {
          appenders: ['console', 'file'],
          level: level,
          enableCallStack: true,
        },
        access: {
          appenders: ['access', 'file'],
          level: 'info',
          enableCallStack: true,
        },
      },
    });
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  fatal(message: string, trace?: string) {
    this.logger.fatal(message, trace);
  }
}
