import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { ConfigModule } from '@nestjs/config';
import { PhotoModule } from './photo/photo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    HelloModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PhotoModule,
    AuthModule,
  ],
})
export class AppModule { }
