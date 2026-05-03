import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { ConfigModule } from '@nestjs/config';
import { HelloCrudModule } from './hello-crud/hello-crud.module';
@Module({
  imports: [
    HelloModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    HelloCrudModule
  ],
})
export class AppModule { }
