import { Inject, Injectable } from '@nestjs/common';
import { PhotoService } from '@src/photo/photo.service';

@Injectable()
export class HelloService {

    constructor(
        private readonly photoService: PhotoService
    ) { }

    getHello(): string {
        return 'Hello World!';
    }

    postHelloWithEmptyBody(): { title: string } {
        return {
            title: "postHelloWithEmptyBody respone default created"
        }
    }

    getPhotos() {
        return this.photoService.findAll()
    }
}
