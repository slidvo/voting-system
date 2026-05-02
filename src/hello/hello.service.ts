import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
    getHello(): string {
        return 'Hello World!';
    }

    postHelloWithEmptyBody(): { title: string } {
        return {
            title: "postHelloWithEmptyBody respone default created"
        }
    }
}
