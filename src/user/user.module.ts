import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { userProviders } from './user.providers';

@Module({
    imports: [DatabaseModule],
    providers: [...userProviders],
    exports: [...userProviders],
})
export class UserModule {}
