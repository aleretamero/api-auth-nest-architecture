import { DataSource, DataSourceOptions } from 'typeorm';
import environment from '@/configs/environment';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: environment.POSTGRES_HOST,
  port: environment.POSTGRES_PORT,
  username: environment.POSTGRES_USER,
  password: environment.POSTGRES_PASS,
  database: environment.POSTGRES_DB,
  ssl: environment.POSTGRES_SSL,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
  synchronize: true,
  // logging: ['query', 'error'],
};

export default new DataSource(dataSourceOptions);
