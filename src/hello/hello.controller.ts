import { Body, Controller, Get, Post } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloBodyRqDto } from './dto/HelloBodyRqDto';

@Controller()
export class HelloController {
  constructor(private readonly helloService: HelloService) { }

  @Get()
  getHello(): string {
    return this.helloService.getHello();
  }

  @Post("/hello")
  postHelloWithEmptyBody() {
    return {
      title: "postHelloWithEmptyBody respone"
    }
  }

  @Post("/hello-with-body")
  postHelloWithBody(@Body() rqBody: HelloBodyRqDto) {
    return {
      title: "postHelloWithBody respone",
      ...rqBody
    }
  }
}
