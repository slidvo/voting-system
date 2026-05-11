import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { ConfigModule } from '@nestjs/config';
import { PhotoModule } from './photo/photo.module';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    HelloModule,
    PhotoModule,
    AuthModule,
    PollModule,
  ],
})
export class AppModule { }
