import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    HelloModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    })
  ],
})
export class AppModule { }
