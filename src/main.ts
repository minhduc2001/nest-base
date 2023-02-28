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

  const configSwagger = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addServer(`http://localhost:${config.PORT}`, 'local')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(config.PORT, () => {
    logger.log(`server is starting on port ${config.PORT}`);
  });
}
bootstrap();
