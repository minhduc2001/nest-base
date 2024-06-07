import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {
  I18nValidationExceptionFilter,
  i18nValidationErrorFactory,
} from 'nestjs-i18n';

import { ResponseTransformInterceptor } from '@base/middleware/response.interceptor';
import { HttpExceptionFilter } from '@base/middleware/http-exception.filter';
import { LoggerService } from '@base/logger/logger.service';
import { config } from '@base/config';
import { SwaggerConfig } from '@base/swagger/swagger.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const loggerService = app.get(LoggerService);
  const logger = loggerService.getLogger();

  app.use(`/uploads`, express.static(config.UPLOAD_LOCATION));
  app.use(bodyParser.json({ limit: config.MAX_FILE_SIZE }));
  app.use(bodyParser.urlencoded({ limit: config.MAX_FILE_SIZE }));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  SwaggerConfig(app, config.API_VERSION);

  app.setGlobalPrefix(`api/${config.API_VERSION}`);

  await app.listen(config.PORT, () => {
    logger.log(`server is starting on port ${config.PORT}`);
  });
}
bootstrap();
