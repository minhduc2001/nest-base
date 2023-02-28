import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const _process = { env: process.env };
process.env = {};

@Injectable()
export class ConfigService {
  FIXED_STATUS_CODE =
    (_process.env.SENTRY_LOG ?? 'true').toLowerCase() === 'true';
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';

  PORT = _process.env.PORT ?? 8080;

  // db
  DB_DATABASE = _process.env.DB_DATABASE;
  DB_PASSWORD = _process.env.DB_PASSWORD;
  DB_USERNAME = _process.env.DB_USERNAME;
  DB_HOST = _process.env.DB_HOST;
  DB_PORT = Number(_process.env.DB_PORT);
}

export const config = new ConfigService();
