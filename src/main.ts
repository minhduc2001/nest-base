import { NestFactory } from '@nestjs/core';
import {
  ValidationError as NestValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from '@/base/middleware/response.interceptor';
import { ValidationError } from '@/base/api/exception.reslover';
import { HttpExceptionFilter } from '@/base/middleware/http-exception.filter';
import { LoggerService } from '@/base/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);

  app.use(`/uploads`, express.static('/uploads'));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: NestValidationError[] = []) =>
        new ValidationError(validationErrors),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
