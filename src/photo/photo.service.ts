
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Photo } from '@src/photo/entities/photo.entity';
import { PHOTO_REPOSITORY } from './photo.constatnts';

@Injectable()
export class PhotoService {
    constructor(
        @Inject(PHOTO_REPOSITORY)
        private photoRepository: Repository<Photo>,
    ) { }

    async findAll(): Promise<Photo[]> {
        return this.photoRepository.find();
    }
}
