import { config } from '@base/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(config.DB_DATABASE);

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
