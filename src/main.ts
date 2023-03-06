import { NestFactory } from '@nestjs/core';
import {
  ValidationError as NestValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ResponseTransformInterceptor } from '@base/middleware/response.interceptor';
import { ValidationError } from '@base/api/exception.reslover';
import { HttpExceptionFilter } from '@base/middleware/http-exception.filter';
import { LoggerService } from '@base/logger/logger.service';
import { config } from '@base/config';

import { AppModule } from './app.module';
import { SwaggerConfig } from '@base/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  const logger = loggerService.getLogger();

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
  const apiVersion = '1';
  SwaggerConfig(app, apiVersion);

  app.setGlobalPrefix(`api/v${apiVersion}`);
  await app.listen(config.PORT, () => {
    logger.log(`server is starting on port ${config.PORT}`);
  });
}
bootstrap();
