import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DATA_SOURCE } from './database.constants';

const logger = new Logger('DatabaseProviders');

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        inject: [ConfigService],
        useFactory: async (config: ConfigService): Promise<DataSource> => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: config.get<boolean>('ORM_SYNC'),
                migrations: process.env.NODE_ENV === 'production'
                    ? ['dist/database/migrations/*.js']
                    : ['src/database/migrations/*.ts'],
            });
            try {
                return await dataSource.initialize();
            } catch (error) {
                logger.error('Failed to connect to the database', error instanceof Error ? error.stack : String(error));
                throw error;
            }
        },
    },
];