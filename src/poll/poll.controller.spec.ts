import { Test, TestingModule } from '@nestjs/testing';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';

describe('PollController', () => {
  let controller: PollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollController],
      providers: [
        PollService,
        {
          provide: PollRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<PollController>(PollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
