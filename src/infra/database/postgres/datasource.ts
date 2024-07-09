import { DataSource, DataSourceOptions } from 'typeorm';
import environments from '@/configs/environment';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: environments.DB_HOST,
  port: environments.DB_PORT,
  username: environments.DB_USERNAME,
  password: environments.DB_PASSWORD,
  database: environments.DB_DATABASE,
  ssl: environments.DB_SSL,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
  synchronize: true,
  logging: ['query', 'error'],
};

export default new DataSource(dataSourceOptions);
