import { Test, TestingModule } from '@nestjs/testing';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';
import { AnswerRepository } from './answer.repository';
import { PollGateway } from './poll.gateway';

describe('PollController', () => {
  let controller: PollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollController, PollGateway],
      providers: [
        PollService,
        {
          provide: PollGateway,
          useValue: {
            emit: jest.fn()
          },
        },
        {
          provide: PollRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          }
        },
        {
          provide: AnswerRepository,
          useValue: {
            save: jest.fn(),
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
