import { Injectable } from '@nestjs/common';
import * as ip from 'ip';
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

  IP = ip.address();
  API_VERSION = '1';

  // db
  DB_DATABASE = _process.env.DB_DATABASE;
  DB_PASSWORD = _process.env.DB_PASSWORD;
  DB_USERNAME = _process.env.DB_USERNAME;
  DB_HOST = _process.env.DB_HOST;
  DB_PORT = Number(_process.env.DB_PORT);

  // jwt
  JWT_SECRET = _process.env.JWT_SECRET;
  JWT_RT_SECRET = _process.env.JWT_RT_SECRET;

  // mailer
  EMAIL = _process.env.EMAIL;
  MAIL_PASSWORD = _process.env.MAIL_PASSWORD;

  // file
  MAX_FILE_SIZE = 10000000; // 10MB;
  UPLOAD_LOCATION = 'uploads';
}

export const config = new ConfigService();
