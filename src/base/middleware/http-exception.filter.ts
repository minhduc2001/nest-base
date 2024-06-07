import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { startCase, toLower } from 'lodash';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const errors: any = exception.getResponse();
    const message: string =
      errors?.message ||
      errors?.error ||
      startCase(toLower(HttpStatus[status]));

    response.status(status).json({
      success: false,
      status_code: status,
      message,
      data: null,
    });
  }
}
