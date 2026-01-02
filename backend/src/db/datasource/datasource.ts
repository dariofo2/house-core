import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const configService = new ConfigService();

export const datasource: DataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get('DB_PORT')),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: ['**/*.entity.ts'],
  migrationsTableName: 'migration',
  synchronize: false,
  migrationsRun: false,
  migrations: ['src/db/migration/*-migration.ts'],
  migrationsTransactionMode: 'all',
  logging: true,
});
