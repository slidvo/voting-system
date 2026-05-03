import { Module } from '@nestjs/common';
import { HelloCrudService } from './hello-crud.service';
import { HelloCrudController } from './hello-crud.controller';

@Module({
  controllers: [HelloCrudController],
  providers: [HelloCrudService],
})
export class HelloCrudModule {}
