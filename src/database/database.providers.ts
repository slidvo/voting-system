import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
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
                synchronize: true,
            });
            return dataSource.initialize();
        },
    },
];