import { config } from '@/config';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@base/logger';

export function uploadUrl(filename: string): string {
  return `${config.IP}:${config.PORT}/api/v${config.API_VERSION}/uploads/${filename}`;
}

@Injectable()
export class UrlService {
  constructor(private readonly loggerService: LoggerService) {}
  private logger = this.loggerService.getLogger(UrlService.name);

  uploadUrl(filename: string): string {
    return `${config.IP}:${config.PORT}/api/v${config.API_VERSION}/uploads/${filename}`;
  }
}
