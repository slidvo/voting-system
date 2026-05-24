import { Test, TestingModule } from '@nestjs/testing';
import { PollService } from './poll.service';
import { PollRepository } from './poll.repository';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from './entities/poll.entity';
import { AnswerRepository } from './answer.repository';

const mockPollRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

const mockAnswerRepository = {
  save: jest.fn(),
};

describe('PollService', () => {
  let service: PollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollService,
        { provide: PollRepository, useValue: mockPollRepository },
        { provide: AnswerRepository, useValue: mockAnswerRepository },
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

  describe('findOne', () => {
    it('should return a PollDto with mapped questions and options', async () => {
      const poll = {
        id: 1,
        title: 'Test Poll',
        description: 'Test desc',
        createdAt: new Date(),
        questions: [
          {
            id: 10,
            text: 'Question 1',
            createdAt: new Date(),
            options: [
              { id: 100, text: 'Option A', createdAt: new Date() },
              { id: 101, text: 'Option B', createdAt: new Date() },
            ],
          },
        ],
      } as Poll;
      mockPollRepository.findOne.mockResolvedValue(poll);

      const result = await service.findOne(1);

      expect(mockPollRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        title: 'Test Poll',
        description: 'Test desc',
        questions: [
          {
            id: 10,
            text: 'Question 1',
            options: [
              { id: 100, text: 'Option A' },
              { id: 101, text: 'Option B' },
            ],
          },
        ],
      });
    });

    it('should throw an error when poll is not found', async () => {
      mockPollRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(42)).rejects.toThrow('Poll with ID 42 not found');
    });

    it('should return a PollDto with empty questions array', async () => {
      const poll = {
        id: 2,
        title: 'Empty Poll',
        description: 'No questions',
        questions: [],
      } as unknown as Poll;
      mockPollRepository.findOne.mockResolvedValue(poll);

      const result = await service.findOne(2);

      expect(result).toEqual({
        id: 2,
        title: 'Empty Poll',
        description: 'No questions',
        questions: [],
      });
    });
  });
});
