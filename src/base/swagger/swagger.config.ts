import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { config } from '@/config';

export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder()
    .setTitle('Nestjs base example')
    .setDescription('The base API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${config.PORT}/api/v${apiVersion}`, 'local')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`api/v${apiVersion}/apidoc`, app, document);
};
