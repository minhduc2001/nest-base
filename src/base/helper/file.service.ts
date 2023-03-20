import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@base/logger';

@Injectable()
export class FileService {
  constructor(private readonly loggerService: LoggerService) {}
  private logger = this.loggerService.getLogger(FileService.name);

  removeFile(filePath: string) {
    const link = path.join('uploads', filePath);
    fs.unlink(link, (error) => {
      if (error) {
        this.logger.error(error.message);
      }
    });
  }
}
