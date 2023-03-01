import { Injectable, Logger } from '@nestjs/common';
import { configure, getLogger } from 'log4js';

import { config } from '@base/config';

const level = config.DEBUG ? 'debug' : 'info';
const appenders = {
  console: {
    type: 'console',
  },
  file: {
    type: 'file',
    filename: 'logs/combined.log',
    pattern: '-yyyy-MM-dd',
    maxLogSize: 1024 * 1024 * 10, // 10 MB
    backups: 3,
  },
};

const categories = {
  default: { appenders: ['console', 'file'], level: level },
};

@Injectable()
export class LoggerService extends Logger {
  constructor() {
    configure({
      appenders: appenders,
      categories: categories,
    });
    super();
  }

  getLogger = getLogger;

  private _access = () => {
    const logger = this.getLogger('access');
    return {
      write: logger.info.bind(logger),
    };
  };

  logger = {
    default: getLogger('default'),
    access: this._access(),
    thirdParty: getLogger('thirdParty'),
  };

  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    super.warn(message, context);
  }

  log(message: string, context?: string): void {
    super.log(message, context);
  }

  debug(message: string, context?: string): void {
    super.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context);
  }
}
