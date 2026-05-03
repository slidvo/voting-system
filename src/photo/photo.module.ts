import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { photoProviders } from '@src/photo/photo.providers';
import { PhotoService } from '@src/photo/photo.service';

@Module({
    imports: [DatabaseModule],
    providers: [
        ...photoProviders,
        PhotoService,
    ],
    exports:[PhotoService]
})
export class PhotoModule { }
