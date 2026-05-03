import { DataSource } from 'typeorm';
import { Photo } from '@src/photo/entities/photo.entity';
import { PHOTO_REPOSITORY } from './photo.constatnts';
import { DATA_SOURCE } from '@src/database/database.constants';

export const photoProviders = [
    {
        provide: PHOTO_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Photo),
        inject: [DATA_SOURCE],
    },
];
