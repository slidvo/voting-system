import { Test, TestingModule } from '@nestjs/testing';
import { HelloCrudController } from './hello-crud.controller';
import { HelloCrudService } from './hello-crud.service';

describe('HelloCrudController', () => {
  let controller: HelloCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloCrudController],
      providers: [HelloCrudService],
    }).compile();

    controller = module.get<HelloCrudController>(HelloCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
