import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { LoggerService } from '@base/logger';

import * as exc from '@base/api/exception.reslover';
import { config } from '@/config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  private logger = this.loggerService.getLogger('http-exception');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    let excResponse = exception.getResponse();
    if (
      (config.FIXED_STATUS_CODE && typeof excResponse !== 'object') ||
      !Object.getOwnPropertyDescriptor(excResponse, 'success')
    ) {
      excResponse = new exc.BadRequest({
        errorCode: exc.STATUS_CODE_MAP[status] ?? exc.UNKNOWN,
        statusCode: status,
        message:
          typeof excResponse === 'object'
            ? excResponse['message']
            : excResponse,
        data: typeof excResponse === 'object' ? excResponse['data'] : null,
      }).getResponse();
    }
    this.logger.error(excResponse?.['message']);
    response.status(status).json(excResponse);
  }
}
