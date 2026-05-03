import { Module } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloController } from './hello.controller';
import { PhotoModule } from '@src/photo/photo.module';

@Module({
  imports: [PhotoModule],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule { }
