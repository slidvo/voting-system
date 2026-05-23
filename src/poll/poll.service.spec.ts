import { Test, TestingModule } from '@nestjs/testing';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from './entities/poll.entity';

const mockPollRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('PollService', () => {
  let service: PollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        { provide: PollRepository, useValue: mockPollRepository },
      ],
    }).compile();

    service = module.get<PollService>(PollService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call pollRepository.create with the given dto and return the result', async () => {
      const dto: CreatePollDto = {
        title: 'Test Poll',
        description: 'Test description',
        questions: [],
      };
      const createdPoll = { id: 1, ...dto } as unknown as Poll;
      mockPollRepository.create.mockResolvedValue(createdPoll);

      const result = await service.create(dto);

      expect(mockPollRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdPoll);
    });
  });

  describe('findAll', () => {
    it('should return a PollsDto with mapped polls', async () => {
      const polls = [
        { id: 1, title: 'Poll 1', description: 'Desc 1', createdAt: new Date() },
        { id: 2, title: 'Poll 2', description: 'Desc 2', createdAt: new Date() },
      ] as Poll[];
      mockPollRepository.findAll.mockResolvedValue(polls);

      const result = await service.findAll();

      expect(mockPollRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        polls: [
          { id: 1, title: 'Poll 1', description: 'Desc 1' },
          { id: 2, title: 'Poll 2', description: 'Desc 2' },
        ],
      });
    });

    it('should return empty polls array when repository returns no polls', async () => {
      mockPollRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual({ polls: [] });
    });
  });
});
