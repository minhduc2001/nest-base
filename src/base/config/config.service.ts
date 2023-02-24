import { Injectable } from '@nestjs/common';
const _process = { env: process.env };
process.env = {};

@Injectable()
export class ConfigService {
  FIXED_STATUS_CODE =
    (_process.env.SENTRY_LOG ?? 'true').toLowerCase() === 'true';
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';
}

export const config = new ConfigService();
