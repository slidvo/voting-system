import * as dotenv from 'dotenv';
import * as path from 'path';
import 'dotenv/config'
import { DataSource } from 'typeorm';
import { Photo } from '../photo/entities/photo.entity';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Photo],
    migrations: process.env.NODE_ENV === 'production'
        ? ['dist/database/migrations/*.js']
        : ['src/database/migrations/*.ts'],
    synchronize: false,
});