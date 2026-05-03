import { Test, TestingModule } from '@nestjs/testing';
import { HelloCrudService } from './hello-crud.service';

describe('HelloCrudService', () => {
  let service: HelloCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloCrudService],
    }).compile();

    service = module.get<HelloCrudService>(HelloCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
