import { Injectable, Logger } from '@nestjs/common';
import { QueryRunner, Logger as TLogger } from 'typeorm';
import { configure, getLogger, Logger as Logger4js } from 'log4js';

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

class DbLogger implements TLogger {
  constructor(private logger: Logger4js) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug(
      `query=${query}` +
        (parameters ? ` parameters=${JSON.stringify(parameters)}` : ``),
    );
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: Error & { code: string },
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.debug(error);
    const errorMessage = error.message ? error.message : error;
    this.logger.error(errorMessage);
    this.logger.error(
      `query=${query} parameters=${JSON.stringify(parameters)}`,
    );
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.logger.warn(
      `time=${time} query=${query} parameters=${JSON.stringify(parameters)}`,
    );
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any {}

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): any {
    this.logger[level](message);
  }
}

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

  getDbLogger(category: string) {
    return new DbLogger(this.getLogger(category));
  }
}
