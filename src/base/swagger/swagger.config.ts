import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { config } from '@/config';

export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  if (config.IS_PRODUCTION) return;

  const options = new DocumentBuilder()
    .setTitle(config.APP.PRODUCT_NAME)
    .setDescription('The base API description')
    .setVersion('1.0')
    .setExternalDoc('Backend overview', '/overview')
    .setLicense('Postman API Docs', '')
    .addBearerAuth()
    .addServer(`http://localhost:${config.PORT}/api/${apiVersion}`, 'local')
    .addServer(`${config.IP}:${config.PORT}/api/${apiVersion}`, 'server')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`apidoc`, app, document);
};
