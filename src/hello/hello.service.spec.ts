import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from './hello.service';
import { PhotoService } from '@src/photo/photo.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloService,
        {
          provide: PhotoService,
          useValue: {
            findAll: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return \"Hello Wold!\"', () => {
    expect(service.getHello()).toBe('Hello World!')
  });
});
