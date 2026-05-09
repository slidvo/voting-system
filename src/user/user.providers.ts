import { DataSource } from 'typeorm';
import { User } from '@src/user/entities/user.entity';
import { USER_REPOSITORY } from './user.constants';
import { DATA_SOURCE } from '@src/database/database.constants';

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE],
    },
];
